import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AdminLayout from '@/layouts/admin/admin-layout';
import SettingsLayout from '@/layouts/settings/layout';
import ShopLayout from '@/layouts/ShopLayout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: show.url(),
    },
];

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.roles.some((role) =>
        ['super-admin', 'admin', 'manager', 'staff'].includes(role),
    );

    const Layout = isAdmin ? AdminLayout : ShopLayout;

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <Layout {...(isAdmin ? { breadcrumbs } : {})}>
            <Head title="Two-Factor Authentication" />
            <SettingsLayout>
                <div className="space-y-6">
                    <div className="rounded-xl border border-terra-100 bg-white p-6 shadow-sm md:p-8">
                        <HeadingSmall
                            title="Two-Factor Authentication"
                            description="Manage your two-factor authentication settings"
                        />
                        <div className="mt-6">
                            {twoFactorEnabled ? (
                                <div className="flex flex-col items-start justify-start space-y-4">
                                    <Badge
                                        variant="default"
                                        className="bg-terra-900 hover:bg-terra-800"
                                    >
                                        Enabled
                                    </Badge>
                                    <p className="text-terra-500">
                                        With two-factor authentication enabled,
                                        you will be prompted for a secure,
                                        random pin during login, which you can
                                        retrieve from the TOTP-supported
                                        application on your phone.
                                    </p>

                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={errors}
                                    />

                                    <div className="relative inline">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <Button
                                                    variant="destructive"
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    <ShieldBan /> Disable 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-start justify-start space-y-4">
                                    <Badge variant="destructive">
                                        Disabled
                                    </Badge>
                                    <p className="text-terra-500">
                                        When you enable two-factor
                                        authentication, you will be prompted for
                                        a secure pin during login. This pin can
                                        be retrieved from a TOTP-supported
                                        application on your phone.
                                    </p>

                                    <div>
                                        {hasSetupData ? (
                                            <Button
                                                onClick={() =>
                                                    setShowSetupModal(true)
                                                }
                                                className="bg-terra-900 text-white hover:bg-terra-800"
                                            >
                                                <ShieldCheck />
                                                Continue Setup
                                            </Button>
                                        ) : (
                                            <Form
                                                {...enable.form()}
                                                onSuccess={() =>
                                                    setShowSetupModal(true)
                                                }
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="bg-terra-900 text-white hover:bg-terra-800"
                                                    >
                                                        <ShieldCheck />
                                                        Enable 2FA
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            )}

                            <TwoFactorSetupModal
                                isOpen={showSetupModal}
                                onClose={() => setShowSetupModal(false)}
                                requiresConfirmation={requiresConfirmation}
                                twoFactorEnabled={twoFactorEnabled}
                                qrCodeSvg={qrCodeSvg}
                                manualSetupKey={manualSetupKey}
                                clearSetupData={clearSetupData}
                                fetchSetupData={fetchSetupData}
                                errors={errors}
                            />
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </Layout>
    );
}
