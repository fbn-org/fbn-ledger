import { useEffect, useState } from 'react';

import {
    Avatar,
    Divider,
    Grid,
    Icon,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Typography,
    useTheme
} from '@mui/material';

import { Group, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, Logout } from '@mui/icons-material';

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import useLedger from '@/contexts/LedgerContext.js';

import PrimaryLayout from '@/layouts/PrimaryLayout.js';

import OccasionCard from '@/components/occasions/OccasionCard.js';
import Card from '@/components/util/Card.js';

dayjs.extend(advancedFormat);
dayjs.extend(utc);

export default function Dashboard() {
    const theme = useTheme();
    const { data: session } = useSession();

    const { occasions, people, ledger } = useLedger();

    const [recentTransactions, setRecentTransactions] = useState(null);
    const [featuredOccasion, setFeaturedOccasion] = useState(null);
    const [peopleStats, setPeopleStats] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    useEffect(() => {
        if (!ledger) return;
        if (ledger.length !== 0) {
            setRecentTransactions(ledger.slice(0, 4));
        }
    }, [ledger]);

    useEffect(() => {
        if (!occasions) return;
        // find the most recent active occasion, and if there isn't find the next upcoming occasion
        let activeOccasions = occasions.filter((occasion) => occasion.timeState === 'active');
        let upcomingOccasions = occasions.filter((occasion) => occasion.timeState === 'upcoming');

        if (activeOccasions.length > 0) {
            setFeaturedOccasion(activeOccasions[0]);
        } else if (upcomingOccasions.length > 0) {
            setFeaturedOccasion(upcomingOccasions[0]);
        } else {
            setFeaturedOccasion(null);
        }
    }, [occasions]);

    useEffect(() => {
        if (!ledger || !people) return;
        // calculate people stats
        let stats = {};
        people.forEach((person) => {
            stats[person._id] = {
                id: person._id,
                name: person.name,
                totalSpend: 0,
                offset: 0
            };
        });

        ledger.forEach((transaction) => {
            let total = parseFloat(transaction.total);
            stats[transaction.payer].offset += total;
            let extra = 0;
            if (transaction.tax !== '') {
                extra += parseFloat(transaction.tax);
            }
            if (transaction.tip !== '') {
                extra += parseFloat(transaction.tip);
            }
            total -= extra;

            let peopleTotals = {};

            Object.keys(transaction.individual_items).forEach((p) => {
                if (!peopleTotals[p]) {
                    peopleTotals[p] = 0;
                }
                let personTotal = transaction.individual_items[p].reduce((acc, item) => acc + parseFloat(item), 0);
                peopleTotals[p] += personTotal;
            });

            // add shared items too
            transaction.shared_items.forEach((item) => {
                item.people.forEach((p) => {
                    if (!peopleTotals[p]) {
                        peopleTotals[p] = 0;
                    }
                    peopleTotals[p] += parseFloat(item.amount) / item.people.length;
                });
            });

            console.log(peopleTotals);

            Object.keys(peopleTotals).forEach((p) => {
                // calculate weight of total and add to stats
                let weight = peopleTotals[p] / total;
                stats[p].totalSpend += peopleTotals[p] + extra * weight;
            });
        });

        people.forEach((person) => {
            stats[person._id].offset -= stats[person._id].totalSpend;
        });

        setPeopleStats(stats);
    }, [people, ledger]);

    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '15px',
                    border: 'none'
                }}
            >
                <Stack
                    direction="row"
                    gap={1}
                    justifyContent="center"
                >
                    <IconButton
                        size="small"
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                        <Avatar src={session?.user?.image} />
                    </IconButton>
                    <Menu
                        open={menuOpen}
                        onClose={() => setAnchorEl(null)}
                        anchorEl={anchorEl}
                    >
                        {/* <Stack
                            direction="column"
                            alignItems="start"
                            justifyContent="start"
                            px={2}
                        >
                            <Typography variant="h6">{session?.user?.name}</Typography>
                        </Stack> */}
                        <MenuList>
                            <MenuItem selected>
                                <ListItemText>FBN</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                as={Link}
                                href="/groups"
                            >
                                <ListItemIcon>
                                    <Group />
                                </ListItemIcon>
                                <ListItemText>Groups</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={signOut}>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText>Sign out</ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Menu>

                    <Typography
                        variant="h4"
                        color="white"
                        textAlign="center"
                        lineHeight={1.5}
                    >
                        FBN
                    </Typography>
                </Stack>

                {people && ledger && occasions ? (
                    <>
                        {recentTransactions ? (
                            // <Card style={{ gap: "10px" }} title="Recent Transactions" icon={<AttachMoney />}>

                            <Grid
                                container
                                spacing={2}
                            >
                                {recentTransactions.map((transaction) => {
                                    const date = dayjs.utc(transaction.date).local().format('MM-DD-YYYY');
                                    const payer = people.find((person) => person._id === transaction.payer)._id;

                                    return (
                                        <Grid
                                            key={transaction._id}
                                            item
                                            xs={6}
                                        >
                                            <Card
                                                title={`$${transaction.total}`}
                                                subtitle={date}
                                                icon={
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: `${payer.toLowerCase()}.main`,
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                    >
                                                        <Icon />
                                                    </Avatar>
                                                }
                                                style={{}}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        ) : // </Card>
                        null}

                        {featuredOccasion ? (
                            <OccasionCard
                                occasion={featuredOccasion}
                                people={people}
                                ledger={ledger}
                                showPayoutsButton={false}
                                disableStats={featuredOccasion.timeState === 'upcoming'}
                            />
                        ) : null}

                        {peopleStats ? (
                            // <Card style={{ gap: "10px" }} title="People" icon={<Person />}>

                            <Grid
                                container
                                spacing={2}
                            >
                                {Object.keys(peopleStats).map((person) => {
                                    const data = peopleStats[person];

                                    return (
                                        <Grid
                                            key={data.id}
                                            item
                                            xs={6}
                                        >
                                            <Card style={{ padding: '15px' }}>
                                                <Stack
                                                    direction="column"
                                                    alignItems="flex-start"
                                                >
                                                    <Stack
                                                        direction="row"
                                                        gap={1}
                                                        alignItems="center"
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: `${data.id.toLowerCase()}.main`,
                                                                height: 18,
                                                                width: 18
                                                            }}
                                                        >
                                                            <Icon />
                                                        </Avatar>
                                                        <Typography
                                                            variant="h6"
                                                            style={{
                                                                color: theme.palette[data.id.toLowerCase()]?.main
                                                            }}
                                                        >
                                                            {data.name}
                                                        </Typography>
                                                    </Stack>
                                                    {/* <Chip label={data.name} color={data.name.toLowerCase()} variant="outlined" size="medium" /> */}

                                                    <div
                                                        style={{
                                                            width: 'auto',
                                                            height: 'auto',
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: 'flex-start',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Typography variant="h5">
                                                            ${data.totalSpend.toFixed(2)}
                                                        </Typography>
                                                    </div>

                                                    <Stack
                                                        direction="row"
                                                        justifyContent="flex-start"
                                                        alignItems="center"
                                                        mt={1}
                                                    >
                                                        {data.offset > 0 ? (
                                                            <KeyboardDoubleArrowUp
                                                                fontSize="small"
                                                                color="success"
                                                            />
                                                        ) : (
                                                            <KeyboardDoubleArrowDown
                                                                fontSize="small"
                                                                color="error"
                                                            />
                                                        )}
                                                        <Typography
                                                            variant="body2"
                                                            color={data.offset > 0 ? 'success.light' : 'error.light'}
                                                        >
                                                            {data.offset > 0 ? '+' : '-'}$
                                                            {data.offset.toFixed(2).replace('-', '')}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        ) : // </Card>
                        null}
                    </>
                ) : null}
            </div>
        </>
    );
}

Dashboard.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;
