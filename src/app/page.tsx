'use client';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (authenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [authenticated, loading, router]);

  return null; // or a loading spinner
}
