import { useEffect, useState } from 'react';

import { BottomNavigation, CssBaseline, BottomNavigationAction, Container, useTheme } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Celebration, Home, ReceiptLong } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { PeopleContext } from '@/contexts/PeopleContext.js';
import { OccasionsContext } from '@/contexts/OccasionsContext.js';
import { LedgerContext } from '@/contexts/LedgerContext.js';

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
            main: '#a0c4ff',
            contrastText: '#000000',
        },
        hudson: {
            main: '#6e78ff',
            contrastText: '#000000',
        }
    },
    shape: {
        borderRadius: 5,
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
            '"Segoe UI Symbol"',
        ].join(','),
    },
})

const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, emotionCache = clientSideEmotionCache, pageProps }) {

    const [selectedPage, setSelectedPage] = useState(0)

    const [occasions, setOccasions] = useState([])
    const [people, setPeople] = useState([])
    const [ledger, setLedger] = useState([])

    function refresh() {
        fetch("/api/occasions/fetchOccasions")
            .then(res => res.json())
            .then(data => {
                // maybe come up with a better way to sort these
                data.sort((a, b) => {
                    if (dayjs(a.start_date) < dayjs(b.end_date)) {
                        return 1
                    }
                    if (dayjs(a.start_date) > dayjs(b.end_date)) {
                        return -1
                    }
                    return 0
                })
                
                // check if each occasion is active or past
                data.forEach(occasion => {
                    occasion.active = new Date(occasion.start_date) < new Date() && new Date(occasion.end_date) >= new Date()
                    occasion.past = new Date(occasion.end_date) < new Date()
                })

                setOccasions(data)
            })

        fetch("/api/fetchPeople")
            .then(res => res.json())
            .then(data => {
                setPeople(data)
            })

        fetch("/api/ledger/fetchLedger")
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => {
                    if (dayjs(a.date) < dayjs(b.date)) {
                        return 1
                    }
                    if (dayjs(a.date) > dayjs(b.date)) {
                        return -1
                    }
                    return 0
                })
                setLedger(data)
            })

    }

    useEffect(() => {
        refresh()
        const interval = setInterval(() => {
            refresh();
        }, 1000)

        return () => clearInterval(interval)
    }, [])


    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <OccasionsContext.Provider value={{occasions, refresh}}>
                        <PeopleContext.Provider value={{people, refresh}}>
                            <LedgerContext.Provider value={{ledger, refresh}}>

                                <CssBaseline />

                                <Container maxWidth="sm" sx={{ position: "fixed", height: "100vh", width: "100%", display: "flex", padding: "0px", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", WebkitOverflowScrolling: "touch" }}>
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

                            </LedgerContext.Provider>
                        </PeopleContext.Provider >
                    </OccasionsContext.Provider>
                </LocalizationProvider>
            </ThemeProvider>
        </CacheProvider>
    )
}
