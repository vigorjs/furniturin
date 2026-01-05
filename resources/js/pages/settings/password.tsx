import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import SettingsLayout from '@/layouts/settings/layout';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <SettingsLayout>
            <Head title="Ubah Kata Sandi" />

            <div>
                <HeadingSmall
                    title="Ubah Kata Sandi"
                    description="Pastikan akun Anda menggunakan kata sandi yang panjang dan acak untuk keamanan"
                />

                <div className="mt-6">
                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-6"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">
                                        Kata Sandi Saat Ini
                                    </Label>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        className="mt-1 block w-full rounded-lg border-terra-200 focus:border-teal-500 focus:ring-teal-500"
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi saat ini"
                                    />
                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Kata Sandi Baru
                                    </Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type="password"
                                        className="mt-1 block w-full rounded-lg border-terra-200 focus:border-teal-500 focus:ring-teal-500"
                                        autoComplete="new-password"
                                        placeholder="Masukkan kata sandi baru"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full rounded-lg border-terra-200 focus:border-teal-500 focus:ring-teal-500"
                                        autoComplete="new-password"
                                        placeholder="Ulangi kata sandi baru"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="rounded-lg bg-teal-500 text-white hover:bg-teal-600"
                                    >
                                        Simpan Kata Sandi
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-600">
                                            Tersimpan
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </SettingsLayout>
    );
}
