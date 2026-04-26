import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import CurrencyInput from '@/Components/CurrencyInput';

const MONTHS = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const EXP_FIELDS = ['exp_personnel','exp_goods','exp_maintenance','exp_travel','exp_general'];
const fmt = (v) => v ? new Intl.NumberFormat('id-ID').format(Math.round(v)) : '';

const SpreadsheetRow = memo(function SpreadsheetRow({ row, idx, onUpdate }) {
    const total = (row.exp_personnel||0) + (row.exp_goods||0) + (row.exp_maintenance||0) + (row.exp_travel||0) + (row.exp_general||0);

    const handleReceiptChange = useCallback((v) => {
        onUpdate(idx, 'receipt_amount', v);
    }, [idx, onUpdate]);

    const handleExpChange = useCallback((field, v) => {
        onUpdate(idx, field, v);
    }, [idx, onUpdate]);

    return (
        <tr className="border-b border-slate-50 hover:bg-slate-50/50">
            <td className="py-2 px-2 text-center text-slate-400 sticky left-0 bg-white">{idx+1}</td>
            <td className="py-2 px-2 text-slate-700 font-medium text-xs">{row.description}</td>
            <td className="py-2 px-2 text-right text-slate-600 font-mono">{fmt(row.allocation)}</td>
            <td className="py-1 px-1 bg-green-50/50">
                <CurrencyInput value={row.receipt_amount} onChange={handleReceiptChange} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-right focus:border-green-400 focus:ring-1 focus:ring-green-200" />
            </td>
            {EXP_FIELDS.map(field=>(
                <td key={field} className="py-1 px-1 bg-blue-50/30">
                    <CurrencyInput value={row[field]} onChange={(v) => handleExpChange(field, v)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-right focus:border-blue-400 focus:ring-1 focus:ring-blue-200" />
                </td>
            ))}
            <td className="py-2 px-2 text-right font-semibold text-slate-800 bg-amber-50/50 font-mono">{fmt(total)}</td>
        </tr>
    );
});

export default function Index({ items: initialItems, category, categories, fiscalYear, fiscalYears, month }) {
    const [rows, setRows] = useState(initialItems || []);
    const [saving, setSaving] = useState(false);
    const { flash } = usePage().props;

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

    useEffect(() => {
        setRows(initialItems || []);
    }, [initialItems]);

    const updateRow = useCallback((idx, field, value) => {
        setRows(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: parseFloat(value) || 0 };
            return updated;
        });
    }, []);

    const handleSave = useCallback(() => {
        setSaving(true);
        router.post(route('monthly-data.bulk-store'), {
            fiscal_year_id: fiscalYear?.id,
            month: month,
            data: rows.map(r => ({
                budget_item_id: r.id,
                receipt_amount: r.receipt_amount || 0,
                exp_personnel: r.exp_personnel || 0,
                exp_goods: r.exp_goods || 0,
                exp_maintenance: r.exp_maintenance || 0,
                exp_travel: r.exp_travel || 0,
                exp_general: r.exp_general || 0,
            })),
        }, {
            preserveState: true,
            onFinish: () => setSaving(false),
        });
    }, [fiscalYear?.id, month, rows]);

    const handleYearChange = useCallback((e) => {
        router.get(route('monthly-data.index'), { fiscal_year_id: e.target.value, month }, { preserveState: true });
    }, [month]);

    const handleMonthChange = useCallback((e) => {
        router.get(route('monthly-data.index'), { fiscal_year_id: fiscalYear?.id, month: e.target.value, category_id: category?.id }, { preserveState: true });
    }, [fiscalYear?.id, category?.id]);

    const handleCategoryChange = useCallback((e) => {
        router.get(route('monthly-data.index'), { fiscal_year_id: fiscalYear?.id, month, category_id: e.target.value }, { preserveState: true });
    }, [fiscalYear?.id, month]);

    return (
        <AuthenticatedLayout header="Input Data Bulanan">
            <Head title="Input Data Bulanan" />
            <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center gap-4 flex-wrap bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">Tahun:</label>
                        <select value={fiscalYear?.id||''} onChange={handleYearChange} className="pl-3 pr-8 py-2 rounded-xl border border-slate-300 text-sm">
                            <option value="">-- Pilih --</option>
                            {fiscalYears.map(f=><option key={f.id} value={f.id}>{f.label||('TA '+f.year)}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">Bulan:</label>
                        <select value={month} onChange={handleMonthChange} className="pl-3 pr-8 py-2 rounded-xl border border-slate-300 text-sm">
                            {orderedMonths.map((m)=><option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">Kategori:</label>
                        <select value={category?.id||''} onChange={handleCategoryChange} className="pl-3 pr-8 py-2 rounded-xl border border-slate-300 text-sm">
                            <option value="">-- Pilih --</option>
                            {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <button onClick={handleSave} disabled={saving||!category} className="ml-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
                        {saving ? '💾 Menyimpan...' : '💾 Simpan Semua'}
                    </button>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                {/* Spreadsheet Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="py-3 px-2 text-center text-slate-500 font-semibold w-10 sticky left-0 bg-slate-100">No</th>
                                <th className="py-3 px-2 text-left text-slate-500 font-semibold min-w-[200px]">Uraian</th>
                                <th className="py-3 px-2 text-right text-slate-500 font-semibold min-w-[100px]">Alokasi</th>
                                <th className="py-3 px-2 text-center text-slate-500 font-semibold min-w-[110px] bg-green-50">Penerimaan</th>
                                <th className="py-3 px-2 text-center text-slate-500 font-semibold min-w-[100px] bg-blue-50">Pers</th>
                                <th className="py-3 px-2 text-center text-slate-500 font-semibold min-w-[100px] bg-blue-50">Barang</th>
                                <th className="py-3 px-2 text-center text-slate-500 font-semibold min-w-[100px] bg-blue-50">Har</th>
                                <th className="py-3 px-2 text-center text-slate-500 font-semibold min-w-[100px] bg-blue-50">Jaldis</th>
                                <th className="py-3 px-2 text-center text-slate-500 font-semibold min-w-[100px] bg-blue-50">Umum</th>
                                <th className="py-3 px-2 text-right text-slate-500 font-semibold min-w-[110px] bg-amber-50">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr><td colSpan="10" className="text-center py-12 text-slate-400">
                                    {category ? 'Belum ada item di kategori ini.' : 'Pilih kategori terlebih dahulu.'}
                                </td></tr>
                            ) : rows.map((row, idx) => (
                                <SpreadsheetRow key={row.id} row={row} idx={idx} onUpdate={updateRow} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
