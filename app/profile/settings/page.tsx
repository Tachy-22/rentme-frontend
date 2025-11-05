import RenterLayout from '@/components/layout/RenterLayout';

export default function SettingsPage() {
  return (
    <RenterLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your account settings.</p>
      </div>
    </RenterLayout>
  );
}