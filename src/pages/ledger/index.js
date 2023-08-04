import { useState } from 'react';

import { Avatar, Fab, Icon, IconButton, Typography } from '@mui/material';

import { Add, Edit, Receipt, ReceiptLong } from '@mui/icons-material';

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';

import useLedger from '@/contexts/LedgerContext';

import PrimaryLayout from '@/layouts/PrimaryLayout';

import EditTransaction from '@/components/ledger/EditTransaction';
import Payouts from '@/components/occasions/Payouts';
import Card from '@/components/util/Card';
import HorizontalGroup from '@/components/util/HorizontalGroup';
import VerticalGroup from '@/components/util/VerticalGroup';

dayjs.extend(advancedFormat);
dayjs.extend(utc);

export default function Ledger(props) {
    const { occasions, people, ledger } = useLedger();

    const [editorOpen, setEditorOpen] = useState(false);
    const [editIsNew, setEditIsNew] = useState(false);
    const [editData, setEditData] = useState(null);

    const [payoutsOpen, setPayoutsOpen] = useState(false);
    const [payoutsData, setPayoutsData] = useState(null);

    function editTransaction(transaction) {
        setEditorOpen(true);
        setEditIsNew(false);
        setEditData(transaction);
    }

    function showPayouts(transaction) {
        setPayoutsOpen(true);
        let data = [transaction];
        setPayoutsData(data);
    }

    return (
        <>
            <Payouts
                onClose={() => {
                    setPayoutsData(null);
                }}
                presetTransactions={payoutsData}
                people={people}
                open={payoutsOpen}
                setOpen={setPayoutsOpen}
            />
            <EditTransaction
                open={editorOpen}
                onClose={() => {
                    setEditorOpen(false);
                    setEditData(null);
                }}
                isNew={editIsNew}
                editData={editData}
                people={people}
                occasions={occasions}
            />

            <Fab
                color="secondary"
                sx={{ position: 'fixed', bottom: 96, right: 16, zIndex: 2 }}
                onClick={() => {
                    setEditorOpen(true);
                    setEditIsNew(true);
                    setEditData(null);
                }}
            >
                <Add />
            </Fab>

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
                <HorizontalGroup style={{ gap: '10px' }}>
                    <ReceiptLong fontSize="large" />
                    <Typography variant="h4">Ledger</Typography>
                </HorizontalGroup>

                <VerticalGroup style={{ width: '100%', gap: '15px' }}>
                    {ledger.map((transaction) => {
                        const payer = people.find((person) => person.id === transaction.payer).name;
                        var date = dayjs.utc(transaction.date).local().format('MMMM Do, YYYY hh:mm A');

                        return (
                            <Card
                                key={transaction._id}
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
                                actions={
                                    <>
                                        {transaction.occasion === 'None' ? (
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    showPayouts(transaction);
                                                }}
                                            >
                                                <Receipt />
                                            </IconButton>
                                        ) : null}
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                editTransaction(transaction);
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </>
                                }
                                style={{ width: '100%' }}
                            >
                                <Typography variant="body1">{transaction.reason}</Typography>
                            </Card>
                        );
                    })}
                </VerticalGroup>
            </div>
        </>
    );
}

Ledger.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;
