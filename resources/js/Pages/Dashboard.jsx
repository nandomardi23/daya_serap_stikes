import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (val) => {
    if (!val && val !== 0) return '-';
    return new Intl.NumberFormat('id-ID').format(Math.round(val));
};

const AbsorptionBar = ({ value, label }) => {
    const color = value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500';
    const bgColor = value >= 75 ? 'bg-emerald-100' : value >= 50 ? 'bg-amber-100' : 'bg-red-100';

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-semibold text-slate-700">{value}%</span>
            </div>
            <div className={`h-2 rounded-full ${bgColor}`}>
                <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
            </div>
        </div>
    );
};

const pct = (val) => {
    if (!val && val !== 0) return '-';
    return `${Math.round(val * 100)}%`;
};
const fmt = formatCurrency;

function SectionRows({ section }) {
    const t = section.totals;
    return (
        <>
            <tr className="bg-[#E2EFDA]">
                <td className="border border-slate-300 px-3 py-2 text-center font-bold text-slate-800">{section.roman}</td>
                <td colSpan="6" className="border border-slate-300 px-3 py-2 font-bold text-slate-800">{section.name}</td>
            </tr>
            {section.rows.map((row, i) => (
                <tr key={row.id} className="hover:bg-slate-50">
                    <td className="border border-slate-200 px-3 py-2 text-center text-slate-600">{i + 1}</td>
                    <td className="border border-slate-200 px-3 py-2 text-slate-700 font-medium whitespace-normal">{row.description}</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-slate-700">{fmt(row.allocation)}</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-slate-700">{fmt(row.receipt_cumulative)}</td>
                    <td className="border border-slate-200 px-3 py-2 text-right font-medium text-slate-800">{fmt(row.exp_cumulative)}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center font-bold text-emerald-600">{pct(row.absorption_expenditure)}</td>
                    <td className="border border-slate-200 px-3 py-2 text-right font-bold text-rose-600">{fmt(row.remaining)}</td>
                </tr>
            ))}
            <tr className="bg-[#FCE4D6] font-bold text-slate-800">
                <td colSpan="2" className="border border-slate-300 px-3 py-3 text-center">JUMLAH {section.roman}</td>
                <td className="border border-slate-300 px-3 py-3 text-right">{fmt(t.allocation)}</td>
                <td className="border border-slate-300 px-3 py-3 text-right">{fmt(t.receipt_cumulative)}</td>
                <td className="border border-slate-300 px-3 py-3 text-right text-blue-900">{fmt(t.exp_cumulative)}</td>
                <td className="border border-slate-300 px-3 py-3 text-center text-emerald-700">{pct(t.absorption_expenditure)}</td>
                <td className="border border-slate-300 px-3 py-3 text-right text-rose-700">{fmt(t.remaining)}</td>
            </tr>
        </>
    );
}

export default function Dashboard({ fiscalYear, summary, reportData, month }) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            {!fiscalYear ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="text-5xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum Ada Tahun Anggaran</h3>
                    <p className="text-slate-500 mb-6">Buat tahun anggaran terlebih dahulu untuk memulai.</p>
                    <Link
                        href={route('fiscal-years.index')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        + Buat Tahun Anggaran
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Fiscal Year Badge */}
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                            {fiscalYear.label || `TA ${fiscalYear.year}`}
                        </span>
                    </div>

                    {/* Summary Cards */}
                    {summary && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">💰</div>
                                        <span className="text-sm text-slate-500">Total Alokasi</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800">Rp {formatCurrency(summary.total_allocation)}</p>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">📥</div>
                                        <span className="text-sm text-slate-500">Total Penerimaan</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800">Rp {formatCurrency(summary.total_receipt)}</p>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">📤</div>
                                        <span className="text-sm text-slate-500">Total Pengeluaran</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800">Rp {formatCurrency(summary.total_expenditure)}</p>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">💵</div>
                                        <span className="text-sm text-slate-500">Sisa Anggaran</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800">Rp {formatCurrency(summary.remaining)}</p>
                                </div>
                            </div>

                            {/* Absorption Summary */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Daya Serap Keseluruhan</h3>
                                    <div className="space-y-4">
                                        <AbsorptionBar value={summary.absorption_receipt} label="Penerimaan" />
                                        <AbsorptionBar value={summary.absorption_expenditure} label="Pengeluaran" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href={route('monthly-data.index')}
                                            className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            ✏️ Input Data
                                        </Link>
                                        <Link
                                            href={route('reports.index')}
                                            className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            📄 Laporan
                                        </Link>
                                        <Link
                                            href={route('budget-items.index')}
                                            className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            📋 Item Anggaran
                                        </Link>
                                        <Link
                                            href={route('budget-categories.index')}
                                            className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            📁 Kategori
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Per-category Stats */}
                            {/* Detailed Report Table */}
                            {reportData && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            Rincian Daya Serap Keseluruhan (1 Tahun / 12 Bulan)
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto p-4">
                                        <table className="w-full text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-[#D9E1F2] text-slate-700">
                                                    <th className="border border-slate-300 px-3 py-3 text-center w-10">No</th>
                                                    <th className="border border-slate-300 px-3 py-3 text-center min-w-[200px]">Uraian</th>
                                                    <th className="border border-slate-300 px-3 py-3 text-center">Alokasi</th>
                                                    <th className="border border-slate-300 px-3 py-3 text-center leading-tight">Total Penerimaan<br/><span className="text-[10px] font-normal text-slate-500">(1 Tahun)</span></th>
                                                    <th className="border border-slate-300 px-3 py-3 text-center leading-tight">Total Pengeluaran<br/><span className="text-[10px] font-normal text-slate-500">(1 Tahun)</span></th>
                                                    <th className="border border-slate-300 px-3 py-3 text-center">Serap (%)</th>
                                                    <th className="border border-slate-300 px-3 py-3 text-center">Sisa Anggaran</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.sections.map(section => (
                                                    <SectionRows key={section.id} section={section} />
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-[#D9E1F2] font-bold text-slate-800 text-sm">
                                                    <td colSpan="2" className="border border-slate-300 px-3 py-4 text-center">TOTAL KESELURUHAN</td>
                                                    <td className="border border-slate-300 px-3 py-4 text-right">{fmt(reportData.grand_totals.allocation)}</td>
                                                    <td className="border border-slate-300 px-3 py-4 text-right text-blue-700">{fmt(reportData.grand_totals.receipt_cumulative)}</td>
                                                    <td className="border border-slate-300 px-3 py-4 text-right text-blue-900">{fmt(reportData.grand_totals.exp_cumulative)}</td>
                                                    <td className="border border-slate-300 px-3 py-4 text-center text-emerald-700">{pct(reportData.grand_totals.absorption_expenditure)}</td>
                                                    <td className="border border-slate-300 px-3 py-4 text-right text-rose-700">{fmt(reportData.grand_totals.remaining)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Target/Batas Penggunaan Anggaran per Bulan */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Patokan Batas Penggunaan Anggaran (Persentase per Bulan)
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="text-left py-3 px-4 text-slate-500 font-medium bg-slate-50 border border-slate-200 w-32">Bulan ke-</th>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                                    <th key={m} className="text-center py-3 px-2 text-slate-600 font-bold bg-slate-50 border border-slate-200 w-16">{m}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-left py-3 px-4 font-medium text-slate-600 bg-blue-50/50 border border-slate-200">Persentase</td>
                                                {[8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100].map(p => (
                                                    <td key={p} className="text-center py-3 px-2 font-bold text-blue-700 bg-blue-50/50 border border-slate-200">
                                                        {p}%
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
