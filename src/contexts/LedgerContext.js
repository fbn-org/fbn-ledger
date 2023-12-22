import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ThemeProvider, createTheme, getContrastRatio } from '@mui/material';

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

    const { data: session } = useSession();

    const user = useMemo(() => {
        if (!session?.user) return null;
        console.log(session.user);
        return {
            ...session.user
        };
    }, [session]);
    const [group, setGroup] = useState(null);
    const [groups, setGroups] = useState(null);
    const [people, setPeople] = useState(null);

    const request = useRequest();

    const [theme, setTheme] = useState(createTheme(baseTheme));

    // fetch group data next
    useEffect(() => {
        if (!user) return;
        const groups = user.groups;

        async function fetchGroups() {
            let groupData = {};

            for (let i = 0; i < groups.length; i++) {
                const groupId = groups[i];
                await request(`/api/groups/${groupId}`, {
                    method: 'GET'
                })
                    .then((data) => {
                        groupData[data.group._id] = data;
                    })
                    .catch((err) => {});
            }
            return groupData;
        }

        fetchGroups().then((groupData) => {
            setGroups(groupData);
            if (groups?.length > 0) {
                setGroup(groupData[groups[0]].group);
                setPeople(groupData[groups[0]].people);
            }
        });
    }, [user, session, request]);

    const refresh = useCallback(() => {
        if (!session?.user) return;

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
    }, [request, session, group]);

    useEffect(() => {
        refresh();
        const interval = setInterval(() => {
            refresh();
        }, 5000);

        return () => clearInterval(interval);
    }, [refresh]);

    // color stuff below this
    function adjust(color, amount) {
        return (
            '#' +
            color
                .replace(/^#/, '')
                .replace(/../g, (color) =>
                    ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
                )
        );
    }

    const generateRealColors = useCallback(async () => {
        if (people) {
            let newColors = {};
            for (let i = 0; i < people.length; i++) {
                const person = people[i];
                await prominent(person.image, { amount: 1, format: 'hex' }).then((color) => {
                    if (getContrastRatio(color, '#111') <= 4.5) {
                        color = adjust(color, 50);
                    }
                    newColors[person._id.toLowerCase()] = {
                        main: color,
                        contrastText: getContrastRatio(color, '#111') > 4.5 ? '#111' : '#fff'
                        // contrastText: '#fff'
                    };
                });
            }
            console.log(newColors);
            return newColors;
        }
    }, [people]);

    const peopleBaseColors = useMemo(() => {
        if (people) {
            let colors = {};
            people.forEach((person) => {
                colors[person._id] = {
                    main: '#fff',
                    contrastText: '#000'
                };
            });
            console.log(colors);
        }
    }, [people]);

    useEffect(() => {
        let newTheme = { ...baseTheme };
        newTheme.palette.primaryText = {
            main: newTheme.palette.text.primary
        };
        if (people) {
            console.log('generating');
            generateRealColors().then((colors) => {
                console.log(colors);
                Object.keys(colors).forEach((personId) => {
                    newTheme.palette[personId.toLowerCase()] = colors[personId];
                });
                setTheme(createTheme(newTheme));
            });
        } else if (peopleBaseColors) {
            console.log('using base');
            Object.keys(peopleBaseColors).forEach((personId) => {
                newTheme.palette[personId.toLowerCase()] = peopleBaseColors[personId];
            });
            setTheme(createTheme(newTheme));
        } else {
            setTheme(createTheme(newTheme));
        }
    }, [generateRealColors, baseTheme, peopleBaseColors, people]);

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

    const checkMembership = useCallback(
        (id) => {
            if (people.find((person) => person._id === id)) {
                return true;
            }
            return false;
        },
        [people]
    );

    const setActiveGroup = useCallback(
        (groupId) => {
            setGroup(groups[groupId].group);
            setPeople(groups[groupId].people);
        },
        [groups]
    );

    return (
        <ThemeProvider theme={theme}>
            <LedgerContext.Provider
                value={{
                    occasions,
                    ledger,

                    user,

                    people,
                    group,
                    groups,
                    setActiveGroup,

                    theme,
                    refresh,

                    getPersonFromId,
                    checkMembership
                }}
            >
                {<>{children}</>}
            </LedgerContext.Provider>
        </ThemeProvider>
    );
}
