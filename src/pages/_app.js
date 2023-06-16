import { BottomNavigation, CssBaseline, BottomNavigationAction, Container } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';
import { Home } from "@mui/icons-material";

const theme = createTheme({
    palette: {
        mode: 'dark',
        colin: {
            main: '#fdffb6',
            contrastText: '#000000',
        },
        eric: {
            main: '#ffd6a5',
            contrastText: '#000000',
        },
        matty: {
            main: '#ffc6ff',
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


    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Container maxWidth="sm" sx={{ height: "100%", width: "100%", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginBottom: "52px" }}>
                    <Component {...pageProps} />

                    <BottomNavigation value={0} sx={{ width: "100%", position: "fixed", bottom: 0 }}>
                        <BottomNavigationAction label="Home" icon={<Home />} />
                    </BottomNavigation>
                </Container>

            </ThemeProvider>
        </CacheProvider>
    )
}
