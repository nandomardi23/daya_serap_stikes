import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo } from 'react';

const MONTHS = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const fmt = (v) => v ? new Intl.NumberFormat('id-ID').format(Math.round(v)) : '-';
const pct = (v) => v ? Math.round(v * 100) + '%' : '0%';

export default function Index({ reportData, fiscalYear, fiscalYears, month }) {
    const startMonth = fiscalYear?.start_month || 1;
    const orderedMonths = useMemo(() => {
        const months = [];
        for (let i = 0; i < 12; i++) {
            let m = startMonth + i;
            if (m > 12) m -= 12;
            months.push({ value: m, label: MONTHS[m] });
        }
        return months;
    }, [startMonth]);

    const handleExport = () => {
        window.location.href = route('reports.export', { fiscal_year_id: fiscalYear?.id, month });
    };

    const handleExportAll = () => {
        window.location.href = route('reports.export', { fiscal_year_id: fiscalYear?.id, all_months: 1 });
    };

    return (
        <AuthenticatedLayout header="Laporan Daya Serap">
            <Head title="Laporan" />
            <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">Tahun:</label>
                        <select value={fiscalYear?.id||''} onChange={e=>router.get(route('reports.index'),{fiscal_year_id:e.target.value,month},{preserveState:true})} className="pl-3 pr-8 py-2 rounded-xl border border-slate-300 text-sm">
                            <option value="">-- Pilih --</option>
                            {fiscalYears.map(f=><option key={f.id} value={f.id}>{f.label||('TA '+f.year)}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">Bulan:</label>
                        <select value={month} onChange={e=>router.get(route('reports.index'),{fiscal_year_id:fiscalYear?.id,month:e.target.value},{preserveState:true})} className="pl-3 pr-8 py-2 rounded-xl border border-slate-300 text-sm">
                            {orderedMonths.map((m)=><option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <button onClick={handleExport} disabled={!reportData} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
                            📥 Download Bulan Ini
                        </button>
                        <button onClick={handleExportAll} disabled={!fiscalYear} className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
                            📥 Download Semua Bulan
                        </button>
                    </div>
                </div>

                {reportData ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-[#D9E1F2]">
                                    <th rowSpan="3" className="border border-slate-300 px-2 py-1 text-center w-8">No</th>
                                    <th rowSpan="3" className="border border-slate-300 px-2 py-1 text-center w-40"></th>
                                    <th rowSpan="3" className="border border-slate-300 px-2 py-1 text-center min-w-[180px]">Uraian</th>
                                    <th rowSpan="3" className="border border-slate-300 px-2 py-1 text-center min-w-[100px]">Alokasi</th>
                                    <th colSpan="2" className="border border-slate-300 px-2 py-1 text-center">Penerimaan Dari Yayasan</th>
                                    <th colSpan="8" className="border border-slate-300 px-2 py-1 text-center">Pengeluaran</th>
                                    <th colSpan="2" className="border border-slate-300 px-2 py-1 text-center">Daya Serap</th>
                                    <th rowSpan="3" className="border border-slate-300 px-2 py-1 text-center min-w-[100px]">Sisa Anggaran</th>
                                </tr>
                                <tr className="bg-[#D9E1F2]">
                                    <th rowSpan="2" className="border border-slate-300 px-1 py-1 text-center text-[10px]">Bulan ini</th>
                                    <th rowSpan="2" className="border border-slate-300 px-1 py-1 text-center text-[10px]">s/d Bulan ini</th>
                                    <th colSpan="5" className="border border-slate-300 px-1 py-1 text-center text-[10px]">Jenis Anggaran</th>
                                    <th colSpan="3" className="border border-slate-300 px-1 py-1 text-center text-[10px]">Jumlah Anggaran</th>
                                    <th rowSpan="2" className="border border-slate-300 px-1 py-1 text-center text-[10px]">Penerimaan</th>
                                    <th rowSpan="2" className="border border-slate-300 px-1 py-1 text-center text-[10px]">Pengeluaran</th>
                                </tr>
                                <tr className="bg-[#D9E1F2]">
                                    <th className="border border-slate-300 px-1 py-1 text-center text-[10px]">Pers</th>
                                    <th className="border border-slate-300 px-1 py-1 text-center text-[10px]">Barang</th>
                                    <th className="border border-slate-300 px-1 py-1 text-center text-[10px]">Har</th>
                                    <th className="border border-slate-300 px-1 py-1 text-center text-[10px]">Jaldis</th>
                                    <th className="border border-slate-300 px-1 py-1 text-center text-[10px]">Umum</th>
                                    <th className="border border-slate-300 px-1 py-1 text-center text-[10px]">Bln Ini</th>
                                    <th className="border border-slate-300 px-1 py-1 text-center text-[10px]">Bln Lalu</th>
                                    <th className="border border-slate-300 px-1 py-1 text-center text-[10px]">s/d Bln Ini</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.sections.map((section, sIdx) => (
                                    <SectionRows key={sIdx} section={section} />
                                ))}
                                {/* Grand Total */}
                                <tr className="bg-[#DDEBF7] font-bold">
                                    <td colSpan="3" className="border border-slate-300 px-2 py-2 text-center">GRAND TOTAL</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.allocation)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.receipt_this_month)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.receipt_cumulative)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.exp_personnel)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.exp_goods)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.exp_maintenance)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.exp_travel)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.exp_general)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.exp_this_month)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.exp_prev_months)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.exp_cumulative)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-center">{pct(reportData.grand_totals.absorption_receipt)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-center">{pct(reportData.grand_totals.absorption_expenditure)}</td>
                                    <td className="border border-slate-300 px-2 py-1 text-right">{fmt(reportData.grand_totals.remaining)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-400">
                        Pilih tahun anggaran dan bulan untuk melihat laporan.
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function SectionRows({ section }) {
    const t = section.totals;
    return (
        <>
            <tr className="bg-[#E2EFDA]">
                <td className="border border-slate-300 px-2 py-2 text-center font-bold">{section.roman}</td>
                <td colSpan="14" className="border border-slate-300 px-2 py-2 font-bold">{section.name}</td>
            </tr>
            {section.rows.map((row, i) => (
                <tr key={row.id} className="hover:bg-slate-50">
                    <td className="border border-slate-200 px-2 py-1 text-center">{i + 1}</td>
                    <td className="border border-slate-200 px-2 py-1 font-mono text-[10px]">{row.account_code}</td>
                    <td className="border border-slate-200 px-2 py-1">{row.description}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.allocation)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.receipt_this_month)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.receipt_cumulative)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.exp_personnel)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.exp_goods)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.exp_maintenance)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.exp_travel)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.exp_general)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.exp_this_month)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.exp_prev_months)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.exp_cumulative)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-center">{pct(row.absorption_receipt)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-center">{pct(row.absorption_expenditure)}</td>
                    <td className="border border-slate-200 px-2 py-1 text-right">{fmt(row.remaining)}</td>
                </tr>
            ))}
            <tr className="bg-[#FCE4D6] font-bold">
                <td colSpan="3" className="border border-slate-300 px-2 py-2 text-center">JUMLAH {section.roman}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.allocation)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.receipt_this_month)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.receipt_cumulative)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.exp_personnel)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.exp_goods)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.exp_maintenance)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.exp_travel)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.exp_general)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.exp_this_month)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.exp_prev_months)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.exp_cumulative)}</td>
                <td className="border border-slate-300 px-2 py-1 text-center">{pct(t.absorption_receipt)}</td>
                <td className="border border-slate-300 px-2 py-1 text-center">{pct(t.absorption_expenditure)}</td>
                <td className="border border-slate-300 px-2 py-1 text-right">{fmt(t.remaining)}</td>
            </tr>
        </>
    );
}
