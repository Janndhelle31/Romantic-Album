import React from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Join the Magic ✨" />

            <div className="text-center mb-8">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block p-4 bg-pink-50 rounded-full mb-4"
                >
                    <span className="text-3xl">🎨</span>
                </motion.div>
                <h1 className="text-3xl font-serif text-gray-800">Create Account</h1>
                <p className="font-handwriting text-xl text-pink-400 mt-1">Start your journey with us</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* NAME FIELD */}
                <div>
                    <label className="block text-xs font-bold text-pink-300 uppercase tracking-widest mb-2 ml-1">
                        Full Name
                    </label>
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="w-full border-pink-100 bg-white/50 rounded-2xl p-4 focus:ring-pink-200 focus:border-pink-300 shadow-sm text-gray-800 placeholder:text-gray-400"
                        autoComplete="name"
                        isFocused={true}
                        placeholder="Your beautiful name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                        className="w-full border-pink-100 bg-white/50 rounded-2xl p-4 focus:ring-pink-200 focus:border-pink-300 shadow-sm text-gray-800 placeholder:text-gray-400"
                        autoComplete="username"
                        placeholder="hello@magic.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* PASSWORD FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-pink-300 uppercase tracking-widest mb-2 ml-1">
                            Password
                        </label>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full border-pink-100 bg-white/50 rounded-2xl p-4 focus:ring-pink-200 focus:border-pink-300 shadow-sm text-gray-800 placeholder:text-gray-400"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-pink-300 uppercase tracking-widest mb-2 ml-1">
                            Confirm Password
                        </label>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full border-pink-100 bg-white/50 rounded-2xl p-4 focus:ring-pink-200 focus:border-pink-300 shadow-sm text-gray-800 placeholder:text-gray-400"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                {/* PASSWORD ERRORS */}
                {(errors.password || errors.password_confirmation) && (
                    <InputError message={errors.password || errors.password_confirmation} />
                )}

                {/* BUTTON */}
                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-100 transition-all transform hover:-translate-y-0.5" 
                        disabled={processing}
                    >
                        {processing ? 'Creating Magic...' : 'Register Now ✨'}
                    </PrimaryButton>
                    
                    {/* FOOTER LINK */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already part of the family?{' '}
                        <Link href={route('login')} className="text-pink-400 font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}