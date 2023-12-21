import { useEffect } from 'react';

import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { CacheProvider } from '@emotion/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';

import { AuthProvider } from '@/contexts/AuthContext';
import { LedgerProvider } from '@/contexts/LedgerContext.js';

import createEmotionCache from '../createEmotionCache';

dayjs.extend(utc);

const baseTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#C2DEDC'
        },
        secondary: {
            main: '#ECE5C7'
        }
    },
    shape: {
        borderRadius: 5
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    // this is the ONLY WAY to fix the background color i have no idea why this works
                    backgroundImage: 'url()'
                }
            }
        }
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(',')
    }
});

const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, session, emotionCache = clientSideEmotionCache, pageProps }) {
    useEffect(() => {
        document.title = 'Ledger';
    }, []);

    const getLayout = Component.getLayout || ((page) => page);

    return (
        <SessionProvider session={session}>
            <CacheProvider value={emotionCache}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <SnackbarProvider
                        autoHideDuration={4000}
                        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                    >
                        <AuthProvider>
                            <LedgerProvider baseTheme={baseTheme}>
                                <CssBaseline />

                                {getLayout(<Component {...pageProps} />)}
                            </LedgerProvider>
                        </AuthProvider>
                    </SnackbarProvider>
                </LocalizationProvider>
            </CacheProvider>
        </SessionProvider>
    );
}
