import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable } from '@/routes/two-factor';
import { usePage } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { SharedData } from '@/types';
import { router } from '@inertiajs/react';

// Simplified Hook usage wrapper or direct component
export default function TwoFactorAuthenticationForm({
    className = '',
}: {
    className?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const twoFactorEnabled = auth.user.two_factor_enabled; 
    
    // We need to re-implement the hook usage or import it if possible
    // The previous file used a hook `useTwoFactorAuth`. Let's assume it works.
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
    const [enabling, setEnabling] = useState(false);
    const [disabling, setDisabling] = useState(false);

    const handleEnable = () => {
        setEnabling(true);
        router.post(enable.url(), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSetupModal(true);
                setEnabling(false);
            },
            onError: () => setEnabling(false),
        });
    };

    const handleDisable = () => {
        if(!confirm('Apakah Anda yakin ingin menonaktifkan 2FA?')) return;
        setDisabling(true);
        router.delete(disable.url(), {
            preserveScroll: true,
            onFinish: () => setDisabling(false),
        });
    };

    return (
        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-terra-100 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-terra-900">
                    Two-Factor Authentication
                </h2>
                <p className="mt-1 text-sm text-terra-500">
                    Tambahkan keamanan ekstra pada akun Anda menggunakan autentikasi dua faktor.
                </p>
            </header>

            <div className="mt-6">
                {twoFactorEnabled ? (
                    <div className="flex flex-col items-start justify-start space-y-4">
                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Aktif</Badge>
                        <p className="text-terra-600 text-sm">
                            Saat autentikasi dua faktor diaktifkan, Anda akan diminta token acak yang aman saat login. Anda dapat mengambil token ini dari aplikasi Google Authenticator di telepon Anda.
                        </p>

                        <TwoFactorRecoveryCodes
                            recoveryCodesList={recoveryCodesList}
                            fetchRecoveryCodes={fetchRecoveryCodes}
                            errors={errors}
                        />

                        <div className="relative inline">
                            <Button
                                variant="destructive"
                                onClick={handleDisable}
                                disabled={disabling}
                                className="bg-red-50 text-red-600 hover:bg-red-100 border-none"
                            >
                                <ShieldBan className="mr-2 h-4 w-4" /> Nonaktifkan 2FA
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-start justify-start space-y-4">
                        <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Nonaktif</Badge>
                        <p className="text-terra-600 text-sm">
                             Saat anda mengaktifkan autentikasi dua faktor, Anda akan diminta token acak yang aman saat login. Token ini dapat diambil dari aplikasi Google Authenticator di telepon Anda.
                        </p>

                        <div>
                            {hasSetupData ? (
                                <Button
                                    onClick={() => setShowSetupModal(true)}
                                    className="bg-terra-900 hover:bg-wood-dark text-white rounded-xl"
                                >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Lanjutkan Setup
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleEnable}
                                    disabled={enabling}
                                    className="bg-terra-900 hover:bg-wood-dark text-white rounded-xl"
                                >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Aktifkan 2FA
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={false}
                    twoFactorEnabled={!!twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    // errors={errors} 
                />
            </div>
        </section>
    );
}
