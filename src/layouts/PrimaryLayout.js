import { useMemo } from 'react';

import { BottomNavigation, BottomNavigationAction, Stack, useTheme } from '@mui/material';

import { Celebration, Home, ReceiptLong } from '@mui/icons-material';

import { usePathname } from 'next/navigation';
import { push } from 'next/router';

import BaseLayout from './BaseLayout';

export default function PrimaryLayout({ children }) {
    const pathname = usePathname();

    const selectedPage = useMemo(() => {
        if (pathname) {
            return pathname.split('/')[2] || '';
        } else {
            return 'dashboard';
        }
    }, [pathname]);

    const theme = useTheme();

    return (
        <BaseLayout>
            <>
                <div
                    style={{
                        width: '100%',
                        height: 'auto',
                        position: 'relative',
                        padding: '15px',
                        flexGrow: 1,
                        overflowY: 'scroll'
                    }}
                >
                    {children}
                </div>

                <Stack
                    direction="column"
                    width="100vw"
                    height="80px"
                    bottom={0}
                    zIndex={100}
                >
                    <BottomNavigation
                        value={selectedPage}
                        sx={{ width: '100%' }}
                    >
                        <BottomNavigationAction
                            label="Home"
                            value="dashboard"
                            icon={<Home />}
                            onClick={() => push('/app/dashboard')}
                        />
                        <BottomNavigationAction
                            label="Occasions"
                            value="occasions"
                            icon={<Celebration />}
                            onClick={() => push('/app/occasions')}
                        />
                        <BottomNavigationAction
                            label="Ledger"
                            value="ledger"
                            icon={<ReceiptLong />}
                            onClick={() => push('/app/ledger')}
                        />
                    </BottomNavigation>
                    <div
                        style={{
                            width: '100%',
                            height: '24px',
                            backgroundColor: theme.palette.background.default
                        }}
                    />
                </Stack>
            </>
        </BaseLayout>
    );
}
