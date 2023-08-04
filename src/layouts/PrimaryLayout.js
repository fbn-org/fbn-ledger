import { useEffect, useMemo } from 'react';

import { BottomNavigation, BottomNavigationAction, Container, useTheme } from '@mui/material';

import { Celebration, Home, ReceiptLong } from '@mui/icons-material';

import { usePathname } from 'next/navigation';
import { push } from 'next/router';

import VerticalGroup from '@/components/util/VerticalGroup';

const pages = ['dashboard', 'occasions', 'ledger'];

export default function PrimaryLayout({ children }) {
    const pathname = usePathname();

    const selectedPage = useMemo(() => {
        if (pathname) {
            return pathname.split('/')[1] || '';
        } else {
            return 'dashboard';
        }
    }, [pathname]);

    useEffect(() => {
        console.log(selectedPage);
    }, [selectedPage]);

    const theme = useTheme();

    return (
        <Container
            maxWidth="sm"
            sx={{
                height: '100vh',
                width: '100%',
                display: 'flex',
                padding: '0px',
                margin: 'auto',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                WebkitOverflowScrolling: 'touch'
            }}
        >
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

                <VerticalGroup
                    style={{
                        width: '100vw',
                        height: '80px',
                        bottom: 0,
                        zIndex: 100
                    }}
                >
                    <BottomNavigation
                        value={selectedPage}
                        sx={{ width: '100%' }}
                    >
                        <BottomNavigationAction
                            label="Home"
                            value="dashboard"
                            icon={<Home />}
                            onClick={() => push('/dashboard')}
                        />
                        <BottomNavigationAction
                            label="Occasions"
                            value="occasions"
                            icon={<Celebration />}
                            onClick={() => push('/occasions')}
                        />
                        <BottomNavigationAction
                            label="Ledger"
                            value="ledger"
                            icon={<ReceiptLong />}
                            onClick={() => push('/ledger')}
                        />
                    </BottomNavigation>
                    <div
                        style={{
                            width: '100%',
                            height: '24px',
                            backgroundColor: theme.palette.background.default
                        }}
                    />
                </VerticalGroup>
            </>
        </Container>
    );
}
