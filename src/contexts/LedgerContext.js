import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { InputAdornment, TextField, ThemeProvider, createTheme } from '@mui/material';

import { Lock } from '@mui/icons-material';

import dayjs from 'dayjs';

import useLocalStorage from '@/util/useLocalStorage';

import request from '@/components/util/API';
import VerticalGroup from '@/components/util/VerticalGroup';

const LedgerContext = createContext([]);

export default function useLedger() {
    const context = useContext(LedgerContext);
    if (!context) {
        throw new Error('useLedger must be used within a LedgerProvider');
    }
    return context;
}

export function LedgerProvider({ children, baseTheme }) {
    const [occasions, setOccasions] = useState(null);
    const [people, setPeople] = useState(null);
    const [ledger, setLedger] = useState(null);

    const [savedPassword, setSavedPassword] = useLocalStorage('password', '');
    const [password, setPassword] = useState(savedPassword);
    const targetPassword = process.env.PASSWORD;

    useEffect(() => {
        if (password) {
            setSavedPassword(password);
        }
    }, [password, setSavedPassword]);

    const refresh = useCallback(() => {
        request('/api/occasions/fetchOccasions')
            .then((res) => res.json())
            .then((data) => {
                // maybe come up with a better way to sort these
                data.sort((a, b) => {
                    if (dayjs(a.start_date) < dayjs(b.end_date)) {
                        return 1;
                    }
                    if (dayjs(a.start_date) > dayjs(b.end_date)) {
                        return -1;
                    }
                    return 0;
                });

                // check if each occasion is active or past
                data.forEach((occasion) => {
                    if (new Date(occasion.start_date) <= new Date() && new Date(occasion.end_date) >= new Date()) {
                        occasion.timeState = 'active';
                    } else if (new Date(occasion.end_date) < new Date()) {
                        occasion.timeState = 'past';
                    } else {
                        occasion.timeState = 'upcoming';
                    }
                });

                setOccasions((old) => {
                    if (JSON.stringify(old) !== JSON.stringify(data)) {
                        return data;
                    } else {
                        return old;
                    }
                });
            });

        request('/api/fetchPeople')
            .then((res) => res.json())
            .then((data) => {
                setPeople((old) => {
                    if (JSON.stringify(old) !== JSON.stringify(data)) {
                        return data;
                    } else {
                        return old;
                    }
                });
            });

        request('/api/ledger/fetchLedger')
            .then((res) => res.json())
            .then((data) => {
                data.sort((a, b) => {
                    if (dayjs(a.date) < dayjs(b.date)) {
                        return 1;
                    }
                    if (dayjs(a.date) > dayjs(b.date)) {
                        return -1;
                    }
                    return 0;
                });
                setLedger((old) => {
                    if (JSON.stringify(old) !== JSON.stringify(data)) {
                        return data;
                    } else {
                        return old;
                    }
                });
            });
    }, []);

    useEffect(() => {
        refresh();
        const interval = setInterval(() => {
            refresh();
        }, 1000);

        return () => clearInterval(interval);
    }, [refresh]);

    const generateTheme = useCallback(
        (people) => {
            if (people) {
                let newTheme = { ...baseTheme };
                people.forEach((person) => {
                    newTheme.palette[person.name.toLowerCase()] = {
                        main: person.color,
                        contrastText: '#000000'
                    };
                });
                newTheme.palette.primaryText = {
                    main: newTheme.palette.text.primary
                };
                return createTheme(newTheme);
            } else {
                return createTheme(baseTheme);
            }
        },
        [baseTheme]
    );

    const theme = useMemo(() => generateTheme(people), [people, generateTheme]);

    return (
        <ThemeProvider theme={theme}>
            <LedgerContext.Provider value={{ occasions, people, ledger, theme, refresh }}>
                {people && occasions && ledger ? (
                    <>
                        {password === targetPassword ? (
                            <>{children}</>
                        ) : (
                            <VerticalGroup
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    flexGrow: 1,
                                    position: 'fixed',
                                    justifyContent: 'center',
                                    background: theme.palette.background.default,
                                    zIndex: 100000
                                }}
                            >
                                <TextField
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={(e) => {
                                        console.log(e);
                                        setPassword(e.target.value);
                                    }}
                                />
                            </VerticalGroup>
                        )}
                    </>
                ) : null}
            </LedgerContext.Provider>
        </ThemeProvider>
    );
}
