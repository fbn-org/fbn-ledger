import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material';

import { prominent } from 'color.js';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

import useRequest from '@/hooks/useRequest';

const LedgerContext = createContext([]);

export default function useLedger() {
    const context = useContext(LedgerContext);
    return context;
}

export function LedgerProvider({ children, baseTheme }) {
    const [occasions, setOccasions] = useState(null);
    const [ledger, setLedger] = useState(null);

    const [user, setUser] = useState(null);
    const [group, setGroup] = useState(null);
    const [people, setPeople] = useState(null);

    const request = useRequest();
    const { data: session } = useSession();

    // first fetch user data
    useEffect(() => {
        if (!session) return;
        request(`/api/people/${session.user.id}`, {
            method: 'GET'
        })
            .then((data) => {
                console.log(data);
                setUser(data);
            })
            .catch((err) => {});
    }, [session, request]);

    // fetch group data next
    useEffect(() => {
        if (!user) return;
        const groupId = user.groups[0]; // also make this work with localstorage
        request(`/api/groups/${groupId}`, {
            method: 'GET'
        })
            .then((data) => {
                setGroup(data.group);
                setPeople(data.people);
            })
            .catch((err) => {});
    }, [user, session, request]);

    const refresh = useCallback(() => {
        if (!session?.user) return;

        console.log(group);

        request(`/api/occasions/fetchOccasions?group=${group?._id}`)
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
            })
            .catch((err) => {});

        request(`/api/ledger/fetchLedger?group=${group?._id}`, {
            method: 'GET'
        })
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
            })
            .catch((err) => {});
    }, [request, session, group?._id]);

    useEffect(() => {
        refresh();
        const interval = setInterval(() => {
            refresh();
        }, 5000);

        return () => clearInterval(interval);
    }, [refresh]);

    const generateTheme = useCallback(
        (people) => {
            if (people) {
                let newTheme = { ...baseTheme };
                people.forEach((person) => {
                    prominent(person.image, { amount: 1, format: 'hex' }).then((color) => {
                        newTheme.palette[person._id.toLowerCase()] = {
                            main: color,
                            // contrastText: getContrastRatio(color, '#111') > 4.5 ? '#111' : '#fff'
                            contrastText: '#fff'
                        };
                    });
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

    const getPersonFromId = useCallback(
        (id) => {
            if (people.find((person) => person._id === id)) {
                return people.find((person) => person._id === id);
            } else {
                return {
                    _id: id,
                    name: 'Unknown',
                    image: ''
                };
            }
        },
        [people]
    );

    return (
        <ThemeProvider theme={theme}>
            <LedgerContext.Provider value={{ occasions, people, ledger, group, user, theme, refresh, getPersonFromId }}>
                {<>{children}</>}
            </LedgerContext.Provider>
        </ThemeProvider>
    );
}
