import { useState, useEffect, useContext } from "react"

import { Chip, IconButton, Typography, Fab, Avatar, Icon } from "@mui/material"
import { Edit, LocalAtm, ReceiptLong, Add, Receipt } from "@mui/icons-material"

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);
dayjs.extend(utc);

import Card from "../util/Card"
import HorizontalGroup from "../util/HorizontalGroup"
import VerticalGroup from "../util/VerticalGroup"
import EditTransaction from "./EditTransaction"

import { OccasionsContext } from "@/contexts/OccasionsContext"
import { PeopleContext } from "@/contexts/PeopleContext"
import { LedgerContext } from "@/contexts/LedgerContext"

import Payouts from "../occasions/Payouts";

export default function Ledger(props) {

    const { occasions } = useContext(OccasionsContext)
    const { people } = useContext(PeopleContext)
    const { ledger } = useContext(LedgerContext)

    const [editorOpen, setEditorOpen] = useState(false)
    const [editIsNew, setEditIsNew] = useState(false)
    const [editData, setEditData] = useState(null)

    const [payoutsOpen, setPayoutsOpen] = useState(false)
    const [payoutsData, setPayoutsData] = useState(null)

    function editTransaction(transaction) {
        setEditorOpen(true)
        setEditIsNew(false)
        setEditData(transaction)
    }

    function showPayouts(transaction) {
        setPayoutsOpen(true)
        let data = [transaction]
        setPayoutsData(data)
    }

    return (
        <>

            <Payouts onClose={() => { setPayoutsData(null) }} presetTransactions={payoutsData} people={people} open={payoutsOpen} setOpen={setPayoutsOpen} />
            <EditTransaction open={editorOpen} onClose={() => { setEditorOpen(false); setEditData(null) }} isNew={editIsNew} editData={editData} people={people} occasions={occasions} />

            <Fab color="secondary" sx={{ position: "fixed", bottom: 96, right: 16, zIndex: 2 }} onClick={() => { setEditorOpen(true); setEditIsNew(true); setEditData(null) }}>
                <Add />
            </Fab>

            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", border: "none" }}>

                <HorizontalGroup style={{ gap: "10px" }}>
                    <ReceiptLong fontSize="large" />
                    <Typography variant="h4">Ledger</Typography>
                </HorizontalGroup>

                <VerticalGroup style={{ width: "100%", gap: "15px", }}>

                    {ledger.map(transaction => {

                        const payer = people.find(person => person._id === transaction.payer).name
                        var date = dayjs.utc(transaction.date).local().format("MMMM Do, YYYY hh:mm A")

                        return (
                            <Card
                                key={transaction._id}
                                title={`$${transaction.total}`}
                                subtitle={date}
                                icon={<Avatar sx={{ bgcolor: `${payer.toLowerCase()}.main`, height: 20, width: 20 }}><Icon /></Avatar>}
                                actions={
                                    <>
                                        {transaction.occasion === "None" ? <IconButton color="primary" onClick={() => { showPayouts(transaction) }}><Receipt /></IconButton> : null}
                                        <IconButton color="primary" onClick={() => { editTransaction(transaction) }}><Edit /></IconButton>
                                    </>}
                                style={{ width: "100%" }}
                            >
                                <Typography variant="body1">
                                    {transaction.reason}
                                </Typography>
                            </Card>

                        )
                    })}

                </VerticalGroup>

            </div>
        </>
    )
}