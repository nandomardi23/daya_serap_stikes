import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import { useState, useCallback } from 'react';

const ROMAN = { 1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X' };

export default function Index({ categories, fiscalYear, fiscalYears }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        fiscal_year_id: fiscalYear?.id || '',
        roman_number: '',
        name: '',
        sub_label: '',
        sort_order: 0,
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        if (fiscalYear?.id) setData('fiscal_year_id', fiscalYear.id);
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setModalMode('edit');
        setSelectedId(category.id);
        setData({
            fiscal_year_id: category.fiscal_year_id,
            roman_number: category.roman_number,
            name: category.name,
            sub_label: category.sub_label || '',
            sort_order: category.sort_order || 0,
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
            put(route('budget-categories.update', selectedId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('budget-categories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    }, [modalMode, selectedId, put, post, closeModal]);

    const handleDelete = useCallback((id, name, itemsCount) => {
        if (itemsCount > 0) {
            Swal.fire({
                title: 'Gagal Menghapus',
                text: `Kategori "${name}" tidak dapat dihapus karena masih memiliki ${itemsCount} item anggaran. Silakan hapus item anggaran di dalamnya terlebih dahulu.`,
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        Swal.fire({
            title: 'Hapus Kategori Anggaran?',
            text: `Apakah Anda yakin ingin menghapus kategori "${name}"? Semua item anggaran dan data bulanan di dalamnya akan ikut terhapus!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('budget-categories.destroy', id));
            }
        });
    }, []);

    return (
        <AuthenticatedLayout header="Kategori Belanja">
            <Head title="Kategori Belanja" />
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-600">Tahun:</label>
                    <select value={fiscalYear?.id||''} onChange={e=>router.get(route('budget-categories.index'),{fiscal_year_id:e.target.value},{preserveState:true})} className="pl-4 pr-8 py-2 rounded-xl border border-slate-300 text-sm">
                        <option value="">-- Pilih --</option>
                        {fiscalYears.map(f=><option key={f.id} value={f.id}>{f.label||('TA '+f.year)}</option>)}
                    </select>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">Kategori Belanja</h3>
                        {fiscalYear && <button onClick={openCreateModal} className="px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">+ Tambah</button>}
                    </div>
                    <table className="w-full text-sm">
                        <thead><tr className="bg-slate-50">
                            <th className="py-3 px-6 text-center text-slate-500 font-medium w-20">No.</th>
                            <th className="py-3 px-6 text-left text-slate-500 font-medium">Nama</th>
                            <th className="py-3 px-6 text-left text-slate-500 font-medium">Sub Label</th>
                            <th className="py-3 px-6 text-center text-slate-500 font-medium">Item</th>
                            <th className="py-3 px-6 text-center text-slate-500 font-medium">Aksi</th>
                        </tr></thead>
                        <tbody>
                            {(!categories||categories.length===0)?(<tr><td colSpan="5" className="text-center py-12 text-slate-400">{fiscalYear?'Belum ada kategori.':'Pilih tahun anggaran.'}</td></tr>)
                            :categories.map(c=>(
                                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                                    <td className="py-3 px-6 text-center font-bold text-amber-600">{ROMAN[c.roman_number]||c.roman_number}</td>
                                    <td className="py-3 px-6 font-semibold text-slate-800">{c.name}</td>
                                    <td className="py-3 px-6 text-slate-500">{c.sub_label||'-'}</td>
                                    <td className="py-3 px-6 text-center"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">{c.items_count}</span></td>
                                    <td className="py-3 px-6 text-center">
                                        <button onClick={()=>openEditModal(c)} className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">Edit</button>
                                        <button onClick={()=>handleDelete(c.id,c.name,c.items_count)} className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">
                        {modalMode === 'edit' ? 'Edit Kategori' : 'Tambah Kategori'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tahun Anggaran *</label>
                            <select value={data.fiscal_year_id} onChange={e=>setData('fiscal_year_id',e.target.value)} className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-slate-300 text-sm">
                                <option value="">-- Pilih --</option>
                                {fiscalYears.map(f=><option key={f.id} value={f.id}>{f.label||('TA '+f.year)}</option>)}
                            </select>
                            {errors.fiscal_year_id && <p className="text-red-500 text-xs mt-1">{errors.fiscal_year_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor Romawi *</label>
                            <input type="number" min="1" max="20" value={data.roman_number} onChange={e=>setData('roman_number',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" placeholder="1 = I, 2 = II, dst" />
                            {errors.roman_number && <p className="text-red-500 text-xs mt-1">{errors.roman_number}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Kategori *</label>
                            <input type="text" value={data.name} onChange={e=>setData('name',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" placeholder="Contoh: BELANJA PERSONEL" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sub Label</label>
                            <input type="text" value={data.sub_label} onChange={e=>setData('sub_label',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" placeholder="Contoh: ANGGARAN OPERASIONAL PENDIDIKAN" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Urutan</label>
                            <input type="number" min="0" value={data.sort_order} onChange={e=>setData('sort_order',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
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
