import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import { useState, useCallback } from 'react';

const fmt = (v) => v ? new Intl.NumberFormat('id-ID').format(Math.round(v)) : '-';

export default function Index({ items, category, categories, fiscalYear, fiscalYears }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        budget_category_id: category?.id || '',
        account_code: '',
        description: '',
        allocation: '',
        sort_order: 0,
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        if (category?.id) setData('budget_category_id', category.id);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setModalMode('edit');
        setSelectedId(item.id);
        setData({
            budget_category_id: item.budget_category_id,
            account_code: item.account_code || '',
            description: item.description || '',
            allocation: item.allocation || '',
            sort_order: item.sort_order || 0,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        reset();
    }, [reset]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (modalMode === 'edit') {
            put(route('budget-items.update', selectedId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('budget-items.store'), {
                onSuccess: () => closeModal(),
            });
        }
    }, [modalMode, selectedId, put, post, closeModal]);

    const handleDelete = useCallback((id, desc, monthlyDataCount) => {
        if (monthlyDataCount > 0) {
            Swal.fire({
                title: 'Gagal Menghapus',
                text: `Item anggaran "${desc}" tidak dapat dihapus karena sudah memiliki ${monthlyDataCount} data bulanan. Silakan bersihkan data tersebut terlebih dahulu jika ingin menghapus.`,
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        Swal.fire({
            title: 'Hapus Item Anggaran?',
            text: `Apakah Anda yakin ingin menghapus item "${desc}"? Semua data bulanan yang terkait akan ikut terhapus!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('budget-items.destroy', id));
            }
        });
    }, []);

    return (
        <AuthenticatedLayout header="Item Anggaran">
            <Head title="Item Anggaran" />
            <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <label className="text-sm font-medium text-slate-600">Tahun:</label>
                    <select value={fiscalYear?.id||''} onChange={e=>router.get(route('budget-items.index'),{fiscal_year_id:e.target.value},{preserveState:true})} className="pl-4 pr-8 py-2 rounded-xl border border-slate-300 text-sm">
                        <option value="">-- Pilih --</option>
                        {fiscalYears.map(f=><option key={f.id} value={f.id}>{f.label||('TA '+f.year)}</option>)}
                    </select>
                    <label className="text-sm font-medium text-slate-600">Kategori:</label>
                    <select value={category?.id||''} onChange={e=>router.get(route('budget-items.index'),{fiscal_year_id:fiscalYear?.id,category_id:e.target.value},{preserveState:true})} className="pl-4 pr-8 py-2 rounded-xl border border-slate-300 text-sm">
                        <option value="">-- Pilih --</option>
                        {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">Item Anggaran {category ? `- ${category.name}` : ''}</h3>
                        {category && <button onClick={openCreateModal} className="px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">+ Tambah</button>}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="bg-slate-50">
                                <th className="py-3 px-4 text-center text-slate-500 font-medium w-12">No</th>
                                <th className="py-3 px-4 text-left text-slate-500 font-medium">Kode Akun</th>
                                <th className="py-3 px-4 text-left text-slate-500 font-medium">Uraian</th>
                                <th className="py-3 px-4 text-right text-slate-500 font-medium">Alokasi</th>
                                <th className="py-3 px-4 text-center text-slate-500 font-medium w-32">Aksi</th>
                            </tr></thead>
                            <tbody>
                                {(!items||items.length===0)?(<tr><td colSpan="5" className="text-center py-12 text-slate-400">Belum ada item.</td></tr>)
                                :items.map((item,i)=>(
                                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-center text-slate-500">{i+1}</td>
                                        <td className="py-3 px-4 text-slate-600 font-mono text-xs">{item.account_code||'-'}</td>
                                        <td className="py-3 px-4 text-slate-800">{item.description}</td>
                                        <td className="py-3 px-4 text-right font-semibold text-slate-800">{fmt(item.allocation)}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button onClick={()=>openEditModal(item)} className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">Edit</button>
                                            <button onClick={()=>handleDelete(item.id,item.description,item.monthly_data_count)} className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">
                        {modalMode === 'edit' ? 'Edit Item' : 'Tambah Item'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori *</label>
                            <select value={data.budget_category_id} onChange={e=>setData('budget_category_id',e.target.value)} className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-slate-300 text-sm">
                                <option value="">-- Pilih --</option>
                                {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.budget_category_id && <p className="text-red-500 text-xs mt-1">{errors.budget_category_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kode Akun</label>
                            <input type="text" value={data.account_code} onChange={e=>setData('account_code',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono" placeholder="04.00.00.02.01.010" />
                            {errors.account_code && <p className="text-red-500 text-xs mt-1">{errors.account_code}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Uraian *</label>
                            <input type="text" value={data.description} onChange={e=>setData('description',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" placeholder="Deskripsi item anggaran" />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Alokasi (Rp) *</label>
                            <input type="number" min="0" step="1" value={data.allocation} onChange={e=>setData('allocation',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" placeholder="0" />
                            {errors.allocation && <p className="text-red-500 text-xs mt-1">{errors.allocation}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Urutan</label>
                            <input type="number" min="0" value={data.sort_order} onChange={e=>setData('sort_order',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
                            {errors.sort_order && <p className="text-red-500 text-xs mt-1">{errors.sort_order}</p>}
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={closeModal} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
