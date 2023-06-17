import { useState } from 'react';

import { BottomNavigation, CssBaseline, BottomNavigationAction, Container, useTheme } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Celebration, Home, ReceiptLong } from "@mui/icons-material";
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
                <CssBaseline />

                <Container maxWidth="sm" sx={{ height: "100%", width: "100%", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginBottom: "76px" }}>
                    <Component {...pageProps} selectedPage={selectedPage} />

                    <VerticalGroup style={{ width: "100%", height: "76px", position: "fixed", bottom: 0 }}>
                        <BottomNavigation value={selectedPage} onChange={(e, newValue) => setSelectedPage(newValue)} sx={{ width: "100%"}}>
                            <BottomNavigationAction label="Home" icon={<Home />} />
                            <BottomNavigationAction label="Occasions" icon={<Celebration />} />
                            <BottomNavigationAction label="Ledger" icon={<ReceiptLong />} />
                        </BottomNavigation>
                        <div style={{ width: "100%", height: "20px", backgroundColor: theme.palette.background.default }} />
                    </VerticalGroup>
                </Container>

            </ThemeProvider>
        </CacheProvider>
    )
}
