import { useState, useEffect, useContext } from "react"

import { Chip, IconButton, Typography, Fab, Avatar, Icon } from "@mui/material"
import { Edit, LocalAtm, ReceiptLong, Add } from "@mui/icons-material"

import Card from "../Card"
import HorizontalGroup from "../HorizontalGroup"
import VerticalGroup from "../VerticalGroup"
import EditTransaction from "./EditTransaction"

import { OccasionsContext } from "@/contexts/OccasionsContext"
import { PeopleContext } from "@/contexts/PeopleContext"
import { LedgerContext } from "@/contexts/LedgerContext"

export default function Ledger(props) {

    const [editorOpen, setEditorOpen] = useState(false)
    const [editIsNew, setEditIsNew] = useState(false)
    const [editData, setEditData] = useState(null)

    const { occasions } = useContext(OccasionsContext)
    const { people } = useContext(PeopleContext)
    const { ledger } = useContext(LedgerContext)

    function editTransaction(transaction) {
        setEditorOpen(true)
        setEditIsNew(false)
        setEditData(transaction)
    }

    return (
        <>

            <EditTransaction open={editorOpen} onClose={() => { setEditorOpen(false) }} isNew={editIsNew} editData={editData} people={people} occasions={occasions} />

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
                        return (
                            <Card
                                key={transaction._id}
                                title={`$${transaction.total}`}
                                subtitle={transaction.date}
                                icon={<Avatar sx={{ bgcolor: `${payer.toLowerCase()}.main`, height: 20, width: 20 }}><Icon /></Avatar>}
                                actions={<IconButton color="primary" onClick={() => { editTransaction(transaction) }}><Edit /></IconButton>}
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