import { useEffect } from 'react';

import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { CacheProvider } from '@emotion/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

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

export default function App({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
    useEffect(() => {
        document.title = 'Ledger';
    }, []);

    const getLayout = Component.getLayout || ((page) => page);

    return (
        <CacheProvider value={emotionCache}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <LedgerProvider baseTheme={baseTheme}>
                    <CssBaseline />

                    {getLayout(<Component {...pageProps} />)}
                </LedgerProvider>
            </LocalizationProvider>
        </CacheProvider>
    );
}
