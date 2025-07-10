'use client';

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export default function LoginPage() {
  const { keycloak, authenticated } = useAuth();

  const handleLogin = () => {
    if (keycloak && !authenticated) {
      keycloak.login();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Flame className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Welcome to Felix</CardTitle>
          <CardDescription>Sign in to continue to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full">
            Login with Keycloak
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
