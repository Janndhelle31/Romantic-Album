import React from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

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
        <GuestLayout>
            <Head title="Welcome Back ✨" />

            <div className="text-center mb-8">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block p-4 bg-pink-50 rounded-full mb-4"
                >
                    <span className="text-3xl">🔒</span>
                </motion.div>
                <h1 className="text-3xl font-serif text-gray-800">Welcome Back</h1>
                <p className="font-handwriting text-xl text-pink-400 mt-1">Sign in to keep creating magic</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-500 bg-green-50 p-3 rounded-xl text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* EMAIL FIELD */}
                <div>
                    <label className="block text-xs font-bold text-pink-300 uppercase tracking-widest mb-2 ml-1">
                        Email Address
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full border-pink-100 bg-white/50 rounded-2xl p-4 focus:ring-pink-200 focus:border-pink-300 shadow-sm"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="yourname@love.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* PASSWORD FIELD */}
                <div>
                    <label className="block text-xs font-bold text-pink-300 uppercase tracking-widest mb-2 ml-1">
                        Password
                    </label>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full border-pink-100 bg-white/50 rounded-2xl p-4 focus:ring-pink-200 focus:border-pink-300 shadow-sm"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* REMEMBER & FORGOT */}
                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded text-pink-400 focus:ring-pink-300 border-pink-200"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-500 group-hover:text-pink-400 transition-colors">
                            Remember us?
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-pink-300 hover:text-pink-500 transition-colors"
                        >
                            Forgot?
                        </Link>
                    )}
                </div>

                {/* BUTTONS */}
                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-100 transition-all transform hover:-translate-y-0.5" 
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Sign In ✨'}
                    </PrimaryButton>
                    
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link href={route('register')} className="text-pink-400 font-bold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}