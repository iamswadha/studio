import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Profile"
          description="Manage your account settings and preferences."
        >
          <Button>Edit Profile</Button>
        </PageHeader>
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is where your profile details will be displayed.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
