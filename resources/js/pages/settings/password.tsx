import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AdminLayout from '@/layouts/admin/admin-layout';
import SettingsLayout from '@/layouts/settings/layout';
import ShopLayout from '@/layouts/ShopLayout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/user-password';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

export default function Password() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.roles.some((role) =>
        ['super-admin', 'admin', 'manager', 'staff'].includes(role),
    );

    const Layout = isAdmin ? AdminLayout : ShopLayout;

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <Layout {...(isAdmin ? { breadcrumbs } : {})}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="rounded-xl border border-terra-100 bg-white p-6 shadow-sm md:p-8">
                        <HeadingSmall
                            title="Update password"
                            description="Ensure your account is using a long, random password to stay secure"
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
                                {({
                                    errors,
                                    processing,
                                    recentlySuccessful,
                                }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="current_password">
                                                Current password
                                            </Label>

                                            <Input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                name="current_password"
                                                type="password"
                                                className="mt-1 block w-full border-terra-200 focus:border-terra-500 focus:ring-terra-500"
                                                autoComplete="current-password"
                                                placeholder="Current password"
                                            />

                                            <InputError
                                                message={
                                                    errors.current_password
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">
                                                New password
                                            </Label>

                                            <Input
                                                id="password"
                                                ref={passwordInput}
                                                name="password"
                                                type="password"
                                                className="mt-1 block w-full border-terra-200 focus:border-terra-500 focus:ring-terra-500"
                                                autoComplete="new-password"
                                                placeholder="New password"
                                            />

                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirm password
                                            </Label>

                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type="password"
                                                className="mt-1 block w-full border-terra-200 focus:border-terra-500 focus:ring-terra-500"
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                            />

                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button
                                                disabled={processing}
                                                data-test="update-password-button"
                                                className="bg-terra-900 text-white hover:bg-terra-800"
                                            >
                                                Save password
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-neutral-600">
                                                    Saved
                                                </p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </Layout>
    );
}
