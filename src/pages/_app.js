import { useState } from 'react';

import { BottomNavigation, CssBaseline, BottomNavigationAction, Container, useTheme } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Celebration, Home, ReceiptLong } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';

import VerticalGroup from '@/components/VerticalGroup';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#C2DEDC',
        },
        secondary: {
            main: '#ECE5C7'
        },
        colin: {
            main: '#ffd6a5',
            contrastText: '#000000',
        },
        eric: {
            main: '#ffadad',
            contrastText: '#000000',
        },
        matty: {
            main: '#bdb2ff',
            contrastText: '#000000',
        },
        hudson: {
            main: '#a0c4ff',
            contrastText: '#000000',
        }
    },
    typography: {
        fontFamily: [
            'Inter',
            'sans-serif'
        ].join(','),
    },
})

const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, emotionCache = clientSideEmotionCache, pageProps }) {

    const [selectedPage, setSelectedPage] = useState(0)

    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline />

                    <Container maxWidth="sm" sx={{ height: "100vh", width: "100%", display: "flex", padding: "0px", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                        <div style={{ width: "100%", height: "auto", position: "relative", padding: "15px", flexGrow: 1, overflowY: "scroll" }}>
                            <Component {...pageProps} selectedPage={selectedPage} />
                        </div>

                        <VerticalGroup style={{ width: "100vw", height: "80px", bottom: 0, zIndex: 100 }}>
                            <BottomNavigation value={selectedPage} onChange={(e, newValue) => setSelectedPage(newValue)} sx={{ width: "100%" }}>
                                <BottomNavigationAction label="Home" icon={<Home />} />
                                <BottomNavigationAction label="Occasions" icon={<Celebration />} />
                                <BottomNavigationAction label="Ledger" icon={<ReceiptLong />} />
                            </BottomNavigation>
                            <div style={{ width: "100%", height: "24px", backgroundColor: theme.palette.background.default }} />
                        </VerticalGroup>
                    </Container>

                </LocalizationProvider>
            </ThemeProvider>
        </CacheProvider>
    )
}
