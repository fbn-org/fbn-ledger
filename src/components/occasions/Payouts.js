import { useEffect, useState } from 'react';

import { Chip, IconButton, Typography } from '@mui/material';

import { Close, KeyboardDoubleArrowRight } from '@mui/icons-material';

import useRequest from '@/hooks/useRequest.js';

import Drawer from '../util/Drawer.js';
import HorizontalGroup from '../util/HorizontalGroup.js';
import VerticalGroup from '../util/VerticalGroup.js';

export default function Payouts(props) {
    const request = useRequest();

    const occasion = props.occasion;
    const people = props.people;
    const setOpen = props.setOpen;
    const open = props.open;
    const presetTransactions = props.presetTransactions;

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
        props.onClose();
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
            <VerticalGroup style={{ width: '100%', alignItems: 'flex-start' }}>
                {owes ? (
                    Object.keys(owes).map((fromId) => {
                        if (Object.keys(owes[fromId]).length > 0) {
                            return (
                                <VerticalGroup
                                    key={fromId}
                                    style={{ width: '100%', gap: '15px', marginBottom: '15px' }}
                                >
                                    {Object.keys(owes[fromId]).map((toId) => {
                                        const fromName = people.find((person) => person.id === fromId).name;
                                        const toName = people.find((person) => person.id === toId).name;

                                        return owes[fromId][toId] > 0 ? (
                                            <HorizontalGroup
                                                key={toId}
                                                style={{
                                                    width: '100%',
                                                    gap: '5px',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Chip
                                                    label={fromName}
                                                    color={fromName.toLowerCase()}
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
                                                    color={toName.toLowerCase()}
                                                    variant="outlined"
                                                    sx={{ flexBasis: '37.5%' }}
                                                />
                                            </HorizontalGroup>
                                        ) : null;
                                    })}
                                </VerticalGroup>
                            );
                        } else return null;
                    })
                ) : (
                    <HorizontalGroup style={{ width: '100%', gap: '5px', justifyContent: 'center' }}>
                        <Typography variant="h6">nothing yet </Typography>
                    </HorizontalGroup>
                )}
            </VerticalGroup>
        </Drawer>
    );
}
