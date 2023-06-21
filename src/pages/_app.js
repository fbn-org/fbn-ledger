import { useEffect, useState } from 'react';

import { BottomNavigation, CssBaseline, BottomNavigationAction, Container, InputAdornment, Typography, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Celebration, Home, Lock, ReceiptLong } from "@mui/icons-material";
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
import useLocalStorage from '@/util/useLocalStorage.js'

import VerticalGroup from '@/components/VerticalGroup';
import HorizontalGroup from '@/components/HorizontalGroup';

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
    const [savedPassword, setSavedPassword] = useLocalStorage("password", "")
    const [password, setPassword] = useState(savedPassword)

    const targetPassword = process.env.PASSWORD

    const [occasions, setOccasions] = useState(null)
    const [people, setPeople] = useState(null)
    const [ledger, setLedger] = useState(null)

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
                    if (new Date(occasion.start_date) <= new Date() && new Date(occasion.end_date) >= new Date()) {
                        occasion.timeState = "active"
                    } else if (new Date(occasion.end_date) < new Date()) {
                        occasion.timeState = "past"
                    } else {
                        occasion.timeState = "upcoming"
                    }
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

    useEffect(() => {
        if (password) {
            setSavedPassword(password)
        }
    }, [password])


    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <OccasionsContext.Provider value={{ occasions, refresh }}>
                        <PeopleContext.Provider value={{ people, refresh }}>
                            <LedgerContext.Provider value={{ ledger, refresh }}>

                                <CssBaseline />

                                {occasions && people && ledger ?
                                    <Container maxWidth="sm" sx={{ height: "100vh", width: "100%", display: "flex", padding: "0px", margin: "auto", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", WebkitOverflowScrolling: "touch" }}>

                                        {savedPassword !== targetPassword ?
                                            <VerticalGroup style={{ width: "100%", height: "100%", flexGrow: 1, position: "fixed", justifyContent: "center", background: theme.palette.background.default, zIndex: 100000 }}>
                                                <HorizontalGroup >
                                                    <TextField variant="outlined" type="password" value={password} InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }} onChange={(e) => setPassword(e.target.value)} />
                                                </HorizontalGroup>
                                            </VerticalGroup>
                                            : null}

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
                                    : null}

                            </LedgerContext.Provider>
                        </PeopleContext.Provider >
                    </OccasionsContext.Provider>
                </LocalizationProvider>
            </ThemeProvider>
        </CacheProvider>
    )
}
