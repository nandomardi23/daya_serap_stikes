import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import { useState, useCallback } from 'react';

export default function Index({ users, roles }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setSelectedId(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            roles: user.roles.map(r => r.name),
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
            put(route('users.update', selectedId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => closeModal(),
            });
        }
    }, [modalMode, selectedId, put, post, closeModal]);

    const handleDelete = useCallback((id, name) => {
        Swal.fire({
            title: 'Hapus User?',
            text: `Apakah Anda yakin ingin menghapus user ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('users.destroy', id));
            }
        });
    }, []);

    const handleRoleChange = (roleName) => {
        const newRoles = data.roles.includes(roleName)
            ? data.roles.filter(r => r !== roleName)
            : [...data.roles, roleName];
        setData('roles', newRoles);
    };

    return (
        <AuthenticatedLayout header="Manajemen User">
            <Head title="Manajemen User" />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Daftar User</h3>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                    >
                        + Tambah User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left py-3 px-6 text-slate-500 font-medium">Nama</th>
                                <th className="text-left py-3 px-6 text-slate-500 font-medium">Email</th>
                                <th className="text-left py-3 px-6 text-slate-500 font-medium">Role</th>
                                <th className="text-center py-3 px-6 text-slate-500 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-slate-400">
                                        Belum ada user. Klik "+ Tambah User" untuk membuat.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-6 font-semibold text-slate-800">{user.name}</td>
                                        <td className="py-3 px-6 text-slate-600">{user.email}</td>
                                        <td className="py-3 px-6">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map(role => (
                                                    <span key={role.id} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase">
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Hapus
                                                </button>
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
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                        {modalMode === 'edit' ? 'Edit User' : 'Tambah User'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Nama <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                                placeholder="Masukkan alamat email"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password {modalMode === 'edit' && <span className="text-slate-400 font-normal">(kosongkan jika tidak ingin mengubah)</span>}
                                {modalMode === 'create' && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                                placeholder="Masukkan password"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                                placeholder="Ulangi password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {roles.map(role => (
                                    <label key={role.id} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={data.roles.includes(role.name)}
                                            onChange={() => handleRoleChange(role.name)}
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                                        />
                                        <span className="text-sm text-slate-700 uppercase font-medium">{role.name}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.roles && <p className="text-red-500 text-xs mt-1">{errors.roles}</p>}
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
