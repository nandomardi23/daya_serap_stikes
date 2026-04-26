import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import { useState, useCallback } from 'react';

export default function Index({ signatories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        position: '',
        position_label: '',
        name: '',
        title: '',
        rank: '',
        nik: '',
        institution: '',
        location: '',
        sort_order: 0,
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (s) => {
        setModalMode('edit');
        setSelectedId(s.id);
        setData({
            position: s.position || '',
            position_label: s.position_label || '',
            name: s.name || '',
            title: s.title || '',
            rank: s.rank || '',
            nik: s.nik || '',
            institution: s.institution || '',
            location: s.location || '',
            sort_order: s.sort_order || 0,
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
            put(route('signatories.update', selectedId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('signatories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    }, [modalMode, selectedId, put, post, closeModal]);

    const handleDelete = useCallback((id, name) => {
        Swal.fire({
            title: 'Hapus Penandatangan?',
            text: `Apakah Anda yakin ingin menghapus penandatangan "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('signatories.destroy', id));
            }
        });
    }, []);

    const F = ({label, field, placeholder, required, type = 'text'}) => (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label} {required&&<span className="text-red-500">*</span>}</label>
            <input type={type} value={data[field]} onChange={e=>setData(field,e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all" placeholder={placeholder} />
            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
        </div>
    );

    return (
        <AuthenticatedLayout header="Penandatangan">
            <Head title="Penandatangan" />
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Daftar Penandatangan</h3>
                    <button onClick={openCreateModal} className="px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">+ Tambah</button>
                </div>
                <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50">
                        <th className="py-3 px-6 text-left text-slate-500 font-medium">Jabatan</th>
                        <th className="py-3 px-6 text-left text-slate-500 font-medium">Nama</th>
                        <th className="py-3 px-6 text-left text-slate-500 font-medium">Gelar</th>
                        <th className="py-3 px-6 text-left text-slate-500 font-medium">NIK</th>
                        <th className="py-3 px-6 text-center text-slate-500 font-medium">Aksi</th>
                    </tr></thead>
                    <tbody>
                        {signatories.length===0?(<tr><td colSpan="5" className="text-center py-12 text-slate-400">Belum ada data.</td></tr>)
                        :signatories.map(s=>(
                            <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                                <td className="py-3 px-6"><span className="font-semibold text-slate-800">{s.position_label}</span><br/><span className="text-xs text-slate-400">{s.position}</span></td>
                                <td className="py-3 px-6 text-slate-700">{s.name}</td>
                                <td className="py-3 px-6 text-slate-500">{s.title||'-'}</td>
                                <td className="py-3 px-6 text-slate-500 font-mono">{s.nik||'-'}</td>
                                <td className="py-3 px-6 text-center">
                                    <button onClick={()=>openEditModal(s)} className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">Edit</button>
                                    <button onClick={()=>handleDelete(s.id,s.name)} className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Create/Edit */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                        {modalMode === 'edit' ? 'Edit Penandatangan' : 'Tambah Penandatangan'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <F label="Position Key" field="position" placeholder="waket_2, ka_biro_keuangan" required />
                            <F label="Label Jabatan" field="position_label" placeholder="Waket II, Ka Biro Keuangan" required />
                        </div>
                        <F label="Nama" field="name" placeholder="Nama lengkap" required />
                        <div className="grid grid-cols-2 gap-4">
                            <F label="Gelar" field="title" placeholder="S.Kep, Ns., M.Kep" />
                            <F label="Pangkat" field="rank" placeholder="Kolonel Laut (K/IV) Purn" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <F label="NIK" field="nik" placeholder="11061" />
                            <F label="Institusi" field="institution" placeholder="STIKES Hang Tuah Tanjungpinang" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <F label="Lokasi" field="location" placeholder="Tanjungpinang" />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Urutan</label>
                                <input type="number" min="0" value={data.sort_order} onChange={e=>setData('sort_order',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={processing} className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-xl text-sm font-medium hover:shadow-lg disabled:opacity-50">{processing?'Menyimpan...':'Simpan'}</button>
                            <button type="button" onClick={closeModal} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">Batal</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
