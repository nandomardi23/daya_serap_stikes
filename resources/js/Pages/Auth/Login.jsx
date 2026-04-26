import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex font-sans bg-slate-50">
            <Head title="Log in - STIKES Hang Tuah" />
            
            {/* Left Panel - Branding (STIKES Hang Tuah Navy Blue Theme) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a1930] via-[#112240] to-[#0a1930] text-white p-16 flex-col justify-between relative overflow-hidden">
                {/* Abstract Decorative Backgrounds */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
                
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="relative z-10 flex items-center gap-5">
                    {/* Medical/Maritime Shield Icon */}
                    <div className="w-16 h-16 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-center p-3 shadow-2xl">
                        <svg className="w-full h-full text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-widest text-white drop-shadow-md">STIKES HANG TUAH</h2>
                        <p className="text-sm text-blue-300 font-semibold tracking-[0.2em] uppercase mt-1">Tanjungpinang</p>
                    </div>
                </div>

                <div className="relative z-10 my-auto">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-wider mb-6">
                        PORTAL INTERNAL
                    </div>
                    <h1 className="text-5xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                        Sistem Informasi <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">
                            Daya Serap Anggaran
                        </span>
                    </h1>
                    <p className="text-lg text-slate-300/90 max-w-lg leading-relaxed font-light">
                        Platform terintegrasi untuk mengelola perencanaan, realisasi, dan pelaporan anggaran secara efisien, transparan, dan akuntabel.
                    </p>
                    
                    <div className="mt-12 flex items-center gap-8 text-sm font-semibold tracking-wider text-slate-300 uppercase">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                            Disiplin
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                            Etika
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                            Kebersihan
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400/80 font-medium gap-4">
                    <div className="flex flex-col gap-1">
                        <p>&copy; {new Date().getFullYear()} STIKES Hang Tuah Tanjungpinang.</p>
                        <p className="text-xs">
                            Presented by <a href="https://www.linkedin.com/in/fernandomardinurzaman/" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">Fernando Mardi Nurzaman</a>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <a href="https://github.com/fernandomardinurzaman" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            GitHub
                        </a>
                        <a href="https://stikesht-tpi.ac.id" target="_blank" className="hover:text-white transition-colors">Website</a>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                {/* Mobile Decorative Background */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl lg:hidden"></div>
                
                <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 relative z-10">
                    <div className="text-center mb-10">
                        {/* Mobile Logo */}
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0a1930] to-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-6 lg:hidden shadow-lg shadow-blue-900/20">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">Selamat Datang</h2>
                        <p className="text-slate-500 font-medium">Silakan masuk ke akun Anda.</p>
                    </div>

                    {status && (
                        <div className="mb-8 p-4 bg-emerald-50 text-sm font-semibold text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-3">
                            <span className="text-xl">✅</span> {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Alamat Email" className="mb-2 text-slate-700 font-bold" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full px-5 py-3.5 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 font-medium text-sm"
                                autoComplete="username"
                                isFocused={true}
                                placeholder="admin@stikesht-tpi.ac.id"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <InputLabel htmlFor="password" value="Kata Sandi" className="text-slate-700 font-bold" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-bold text-[#1e3a5f] hover:text-blue-600 transition-colors"
                                    >
                                        Lupa Sandi?
                                    </Link>
                                )}
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full px-5 py-3.5 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 font-medium text-sm tracking-widest"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f] peer cursor-pointer"
                                    />
                                </div>
                                <span className="ms-3 text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                                    Ingat sesi saya
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-4 py-4 px-4 bg-gradient-to-r from-[#0a1930] to-[#1e3a5f] hover:from-[#112240] hover:to-[#2d5a8e] text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {processing ? 'MEMPROSES...' : 'MASUK SEKARANG'}
                        </button>
                    </form>
                </div>
                
                {/* Mobile STIKES Watermark */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-semibold text-slate-400 lg:hidden flex flex-col gap-1">
                    <p>&copy; {new Date().getFullYear()} STIKES Hang Tuah Tanjungpinang</p>
                    <p className="text-[10px] font-medium text-slate-400">
                        Presented by <a href="https://www.linkedin.com/in/fernandomardinurzaman/" target="_blank" className="text-blue-500 hover:text-blue-600 transition-colors">Fernando Mardi Nurzaman</a> | <a href="https://github.com/fernandomardinurzaman" target="_blank" className="text-slate-500 hover:text-slate-700 transition-colors">GitHub</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
