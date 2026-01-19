import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { SiteSettings } from '@/types';

export default function Register() {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Furniturin';

    return (
        <AuthLayout
            title="Buat Akun Baru"
            description={`Daftar untuk mulai berbelanja di ${siteName}`}
        >
            <Head title="Daftar" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="font-medium text-neutral-700"
                                >
                                    Nama Lengkap
                                </Label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="font-medium text-neutral-700"
                                >
                                    Alamat Email
                                </Label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Masukkan alamat email"
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="font-medium text-neutral-700"
                                >
                                    Kata Sandi
                                </Label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="font-medium text-neutral-700"
                                >
                                    Konfirmasi Kata Sandi
                                </Label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi"
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <button
                                type="submit"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-300 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing && (
                                    <Spinner className="text-white" />
                                )}
                                Daftar Sekarang
                            </button>
                        </div>

                        <div className="pt-2 text-center text-sm text-neutral-500">
                            Sudah punya akun?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-medium text-teal-600 transition-colors hover:text-teal-700"
                            >
                                Masuk di sini
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
