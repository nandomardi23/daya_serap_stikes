import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import { useState, useMemo, useCallback } from 'react';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const MONTHS = [
    { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
    { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' }
];

export default function Index({ fiscalYears }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);

    const currentYear = new Date().getFullYear();
    const yearOptions = useMemo(() => {
        const options = [];
        for (let y = currentYear - 3; y <= currentYear + 15; y++) {
            options.push(`${y}/${y + 1}`);
        }
        return options;
    }, [currentYear]);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        year: '',
        start_month: 1,
        label: '',
        is_active: false,
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (fy) => {
        setModalMode('edit');
        setSelectedId(fy.id);
        setData({
            year: fy.year,
            start_month: fy.start_month || 1,
            label: fy.label || '',
            is_active: fy.is_active || false,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        reset();
    }, [reset]);

    const handleYearChange = useCallback((value) => {
        setData(prev => ({
            ...prev,
            year: value,
            label: value ? `TA ${value}` : '',
        }));
    }, [setData]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (modalMode === 'edit') {
            put(route('fiscal-years.update', selectedId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('fiscal-years.store'), {
                onSuccess: () => closeModal(),
            });
        }
    }, [modalMode, selectedId, put, post, closeModal]);

    const handleDelete = useCallback((id, label, categoriesCount) => {
        if (categoriesCount > 0) {
            Swal.fire({
                title: 'Gagal Menghapus',
                text: `Tahun anggaran ${label} tidak dapat dihapus karena masih memiliki ${categoriesCount} kategori. Silakan hapus kategori di dalamnya terlebih dahulu.`,
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        Swal.fire({
            title: 'Hapus Tahun Anggaran?',
            text: `Apakah Anda yakin ingin menghapus tahun anggaran ${label}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('fiscal-years.destroy', id));
            }
        });
    }, []);

    const handleActivate = useCallback((id) => {
        router.post(route('fiscal-years.activate', id));
    }, []);

    return (
        <AuthenticatedLayout header="Tahun Anggaran">
            <Head title="Tahun Anggaran" />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Daftar Tahun Anggaran</h3>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                    >
                        + Tambah
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left py-3 px-6 text-slate-500 font-medium">Tahun Anggaran</th>
                                <th className="text-left py-3 px-6 text-slate-500 font-medium">Tahun</th>
                                <th className="text-center py-3 px-6 text-slate-500 font-medium">Bulan Mulai</th>
                                <th className="text-center py-3 px-6 text-slate-500 font-medium">Kategori</th>
                                <th className="text-center py-3 px-6 text-slate-500 font-medium">Status</th>
                                <th className="text-center py-3 px-6 text-slate-500 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fiscalYears.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-slate-400">
                                        Belum ada tahun anggaran. Klik "+ Tambah" untuk membuat.
                                    </td>
                                </tr>
                            ) : (
                                fiscalYears.map((fy) => (
                                    <tr key={fy.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-6 font-semibold text-slate-800">{fy.label || `TA ${fy.year}`}</td>
                                        <td className="py-3 px-6 text-slate-500 font-mono text-xs">{fy.year}</td>
                                        <td className="py-3 px-6 text-center text-slate-600 font-medium">{MONTH_NAMES[(fy.start_month||1)-1]}</td>
                                        <td className="py-3 px-6 text-center text-slate-600">{fy.categories_count}</td>
                                        <td className="py-3 px-6 text-center">
                                            {fy.is_active ? (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Aktif</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleActivate(fy.id)}
                                                    className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold hover:bg-amber-100 hover:text-amber-700 transition-colors"
                                                >
                                                    Set Aktif
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(fy)}
                                                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(fy.id, fy.label || `TA ${fy.year}`, fy.categories_count)}
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
                        {modalMode === 'edit' ? 'Edit Tahun Anggaran' : 'Tambah Tahun Anggaran'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Tahun Anggaran <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.year}
                                onChange={(e) => handleYearChange(e.target.value)}
                                className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                            >
                                <option value="">-- Pilih Tahun Anggaran --</option>
                                {yearOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Bulan Mulai <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.start_month}
                                onChange={(e) => setData('start_month', parseInt(e.target.value))}
                                className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                            >
                                {MONTHS.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                            <p className="text-slate-400 text-xs mt-1">Bulan pertama dalam siklus tahun anggaran ini.</p>
                            {errors.start_month && <p className="text-red-500 text-xs mt-1">{errors.start_month}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
                            <input
                                type="text"
                                value={data.label}
                                readOnly
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 cursor-not-allowed"
                                placeholder="Otomatis terisi dari tahun anggaran"
                            />
                            <p className="text-slate-400 text-xs mt-1">Label dibuat otomatis dari tahun anggaran yang dipilih.</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                                />
                                <span className="text-sm text-slate-700">Set sebagai tahun aktif</span>
                            </label>
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
