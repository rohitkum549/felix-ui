'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import keycloak from '@/lib/keycloak';
import type { KeycloakInstance } from 'keycloak-js';
import { usePathname, useRouter } from 'next/navigation';
import { Flame } from 'lucide-react';

interface AuthContextType {
  keycloak: KeycloakInstance | null;
  authenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  keycloak: null,
  authenticated: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

const publicPaths = ['/login'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthContextType>({
    keycloak: null,
    authenticated: false,
    loading: true,
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        });
        
        setAuth({ keycloak, authenticated, loading: false });

      } catch (error) {
        console.error('Failed to initialize Keycloak', error);
        setAuth({ keycloak, authenticated: false, loading: false });
      }
    };
    
    initKeycloak();

  }, []);

  useEffect(() => {
    if (auth.loading) {
      return;
    }

    const isPublicPath = publicPaths.includes(pathname);

    if (!auth.authenticated && !isPublicPath) {
      router.push('/login');
    } else if (auth.authenticated && isPublicPath) {
      router.push('/dashboard');
    }

  }, [auth.authenticated, auth.loading, pathname, router]);


  if (auth.loading) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
            <Flame className="h-16 w-16 animate-pulse text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
        </div>
    )
  }

  if (!auth.authenticated && !publicPaths.includes(pathname)) {
     return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
            <Flame className="h-16 w-16 animate-pulse text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Redirecting to login...</p>
        </div>
    )
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
