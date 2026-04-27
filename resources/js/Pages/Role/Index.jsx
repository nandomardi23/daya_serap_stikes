import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import { useState, useCallback } from 'react';

export default function Index({ roles, permissions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        permissions: [],
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (role) => {
        setModalMode('edit');
        setSelectedId(role.id);
        setData({
            name: role.name,
            permissions: role.permissions.map(p => p.name),
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
            put(route('roles.update', selectedId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('roles.store'), {
                onSuccess: () => closeModal(),
            });
        }
    }, [modalMode, selectedId, put, post, closeModal]);

    const handleDelete = useCallback((id, name) => {
        Swal.fire({
            title: 'Hapus Role?',
            text: `Apakah Anda yakin ingin menghapus role ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('roles.destroy', id));
            }
        });
    }, []);

    const handlePermissionChange = (permName) => {
        const newPermissions = data.permissions.includes(permName)
            ? data.permissions.filter(p => p !== permName)
            : [...data.permissions, permName];
        setData('permissions', newPermissions);
    };

    return (
        <AuthenticatedLayout header="Manajemen Role">
            <Head title="Manajemen Role" />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Daftar Role</h3>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                    >
                        + Tambah Role
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left py-3 px-6 text-slate-500 font-medium">Nama Role</th>
                                <th className="text-left py-3 px-6 text-slate-500 font-medium">Permissions</th>
                                <th className="text-center py-3 px-6 text-slate-500 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-12 text-slate-400">
                                        Belum ada role. Klik "+ Tambah Role" untuk membuat.
                                    </td>
                                </tr>
                            ) : (
                                roles.map((role) => (
                                    <tr key={role.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-6 font-semibold text-slate-800 uppercase">{role.name}</td>
                                        <td className="py-3 px-6">
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.map(perm => (
                                                    <span key={perm.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                                                        {perm.name}
                                                    </span>
                                                ))}
                                                {role.permissions.length === 0 && <span className="text-slate-400 text-xs italic">No permissions</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(role)}
                                                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                {role.name !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(role.id, role.name)}
                                                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Create/Edit */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                        {modalMode === 'edit' ? 'Edit Role' : 'Tambah Role'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Nama Role <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                                placeholder="Contoh: admin, user, viewer"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Permissions
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border border-slate-100 rounded-xl bg-slate-50">
                                {permissions.map(perm => (
                                    <label key={perm.id} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.includes(perm.name)}
                                            onChange={() => handlePermissionChange(perm.name)}
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                                        />
                                        <span className="text-xs text-slate-700">{perm.name}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.permissions && <p className="text-red-500 text-xs mt-1">{errors.permissions}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
