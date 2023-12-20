import { createContext, useEffect, useMemo } from 'react';

import { signIn, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const AuthContext = createContext([]);

export function AuthProvider({ children }) {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const page = useMemo(() => {
        if (pathname) {
            return pathname.split('/')[1] || '';
        } else {
            return 'dashboard';
        }
    }, [pathname]);

    useEffect(() => {
        if (page === 'auth') return; // do nothing if on auth page
        if (status === 'loading') return; // do nothing while loading
        if (!session) return signIn(); // If not authenticated, force log in
    }, [session, status, page]);

    return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>;
}
