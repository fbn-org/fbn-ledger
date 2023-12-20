import { useEffect, useState } from 'react';

import { Chip, IconButton, Stack, Typography } from '@mui/material';

import { Close, KeyboardDoubleArrowRight } from '@mui/icons-material';

import useLedger from '@/contexts/LedgerContext.js';

import useRequest from '@/hooks/useRequest.js';

import Drawer from '../util/Drawer.js';

export default function Payouts({ occasion, people, setOpen, open, presetTransactions, onClose }) {
    const request = useRequest();

    const { getPersonFromId, checkMembership } = useLedger();

    const [transactions, setTransactions] = useState([]);
    const [owes, setOwes] = useState(null);

    useEffect(() => {
        if (occasion) {
            request(`/api/ledger/fetchTransactions/${occasion._id}`, {
                method: 'GET'
            })
                .then((data) => {
                    setTransactions(data);
                })
                .catch((err) => {});
        }
    }, [occasion, request]);

    useEffect(() => {
        processPayments(transactions);
    }, [transactions]);

    useEffect(() => {
        if (presetTransactions) {
            setTransactions(presetTransactions);
        }
    }, [presetTransactions]);

    function processPayments(transactions) {
        var owes = {};

        transactions.forEach((transaction) => {
            let totals = {};

            let payer = transaction.payer;
            let fullTotal = transaction.total;
            let extra = 0;
            if (transaction.tax !== '') {
                extra += parseFloat(transaction.tax);
            }
            if (transaction.tip !== '') {
                extra += parseFloat(transaction.tip);
            }
            fullTotal -= extra;

            Object.keys(transaction.individual_items).forEach((personId) => {
                let total = transaction.individual_items[personId].reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
                totals[personId] = total;
            });

            transaction.shared_items.forEach((item) => {
                let people = item.people;
                let amountPerPerson = parseFloat(item.amount) / people.length;

                people.forEach((personId) => {
                    if (totals[personId]) {
                        totals[personId] += amountPerPerson;
                    } else {
                        totals[personId] = amountPerPerson;
                    }
                });
            });

            console.log(totals);

            Object.keys(totals).forEach((personId) => {
                let total = totals[personId];
                let weight = total / fullTotal;
                totals[personId] = (total + extra * weight).toFixed(2);
            });

            Object.keys(totals).forEach((personId) => {
                if (!owes[personId]) {
                    owes[personId] = {};
                }

                if (personId !== payer) {
                    if (owes[personId][payer]) {
                        owes[personId][payer] += parseFloat(totals[personId]);
                    } else {
                        owes[personId][payer] = parseFloat(totals[personId]);
                    }
                }
            });
        });

        // cross check everyone's owes and subtract any redundant costs
        Object.keys(owes).forEach((fromId) => {
            Object.keys(owes[fromId]).forEach((toId) => {
                if (owes[toId][fromId] && owes[fromId][toId]) {
                    if (owes[toId][fromId] > owes[fromId][toId]) {
                        owes[toId][fromId] -= owes[fromId][toId];
                        delete owes[fromId][toId];
                    } else {
                        owes[fromId][toId] -= owes[toId][fromId];
                        delete owes[toId][fromId];
                    }
                }
            });
        });

        if (Object.keys(owes).length > 0) {
            setOwes(owes);
        }
    }

    function close() {
        setOpen(false);
        setOwes(null);
        setTransactions([]);
        onClose();
    }

    return (
        <Drawer
            title="Payouts"
            subtitle={occasion ? occasion.name : null}
            open={open}
            actions={
                <IconButton
                    onClick={close}
                    color="secondary"
                >
                    <Close />
                </IconButton>
            }
        >
            <Stack
                direction="column"
                width="100%"
                alignItems="flex-start"
                justifyContent="center"
            >
                {owes ? (
                    Object.keys(owes).map((fromId) => {
                        if (Object.keys(owes[fromId]).length > 0) {
                            return (
                                <Stack
                                    direction="column"
                                    width="100%"
                                    gap={2}
                                    mb={2}
                                    key={fromId}
                                >
                                    {Object.keys(owes[fromId]).map((toId) => {
                                        const fromName = getPersonFromId(fromId).name;
                                        const toName = getPersonFromId(toId).name;

                                        return owes[fromId][toId] > 0 ? (
                                            <Stack
                                                direction="row"
                                                width="100%"
                                                gap={1}
                                                justifyContent="center"
                                                alignItems="center"
                                                key={toId}
                                            >
                                                <Chip
                                                    label={fromName}
                                                    color={checkMembership(fromId) ? fromId : 'default'}
                                                    variant="outlined"
                                                    sx={{ flexBasis: '37.5%' }}
                                                />
                                                <KeyboardDoubleArrowRight />
                                                <Typography
                                                    variant="h6"
                                                    sx={{ flexBasis: '25%', textAlign: 'center' }}
                                                >
                                                    ${owes[fromId][toId].toFixed(2)}
                                                </Typography>
                                                <KeyboardDoubleArrowRight />
                                                <Chip
                                                    label={toName}
                                                    color={checkMembership(toId) ? toId : 'default'}
                                                    variant="outlined"
                                                    sx={{ flexBasis: '37.5%' }}
                                                />
                                            </Stack>
                                        ) : null;
                                    })}
                                </Stack>
                            );
                        } else return null;
                    })
                ) : (
                    <Stack
                        direction="row"
                        width="100%"
                        gap={1}
                        justifyContent="center"
                    >
                        <Typography variant="h6">nothing yet</Typography>
                    </Stack>
                )}
            </Stack>
        </Drawer>
    );
}
