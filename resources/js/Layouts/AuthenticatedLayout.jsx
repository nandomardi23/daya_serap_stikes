import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const NAV_ITEMS = [
    { name: 'Dashboard', route: 'dashboard', icon: '📊' },
    { name: 'Tahun Anggaran', route: 'fiscal-years.index', icon: '📅' },
    { name: 'Kategori Belanja', route: 'budget-categories.index', icon: '📁' },
    { name: 'Item Anggaran', route: 'budget-items.index', icon: '📋' },
    { name: 'Input Data Bulanan', route: 'monthly-data.index', icon: '✏️' },
    { name: 'Laporan', route: 'reports.index', icon: '📄' },
    { name: 'Penandatangan', route: 'signatories.index', icon: '✍️' },
];

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0f172a] to-[#1e3a5f]
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:shrink-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            DS
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-sm leading-tight">Daya Serap</h1>
                            <p className="text-slate-400 text-xs">Anggaran</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {NAV_ITEMS.map((item) => {
                            const isActive = route().current(item.route) ||
                                route().current(item.route.replace('.index', '.*'));

                            return (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    className={`
                                        flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                                        transition-all duration-200
                                        ${isActive
                                            ? 'bg-white/15 text-white shadow-sm'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="px-4 py-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-semibold text-sm">
                                {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {header && (
                                <h2 className="text-lg font-semibold text-slate-800">{header}</h2>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                                        {user.name}
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fill="currentColor" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Keluar</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
