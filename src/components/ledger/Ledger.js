import { useState, useEffect } from "react"

import { Chip, IconButton, Typography, Fab } from "@mui/material"
import { Edit, LocalAtm, ReceiptLong, Add } from "@mui/icons-material"

import Card from "../Card"
import HorizontalGroup from "../HorizontalGroup"
import VerticalGroup from "../VerticalGroup"
import EditTransaction from "./EditTransaction"

export default function Ledger(props) {

    const [editorOpen, setEditorOpen] = useState(false)
    const [editIsNew, setEditIsNew] = useState(false)
    const [editData, setEditData] = useState(null)

    const [transactions, setTransactions] = useState([])
    const [people, setPeople] = useState([])

    useEffect(() => {
        refreshTransactions()
        fetch("/api/fetchPeople")
            .then(res => res.json())
            .then(data => {
                setPeople(data)
            })

        const refresh = setInterval(() => {
            refreshTransactions()
        }, 1000)

        return () => {
            clearInterval(refresh)
        }
    }, [])

    function refreshTransactions() {
        fetch("/api/occasions/fetchOccasions")
            .then(res => res.json())
            .then(data => {
                // maybe come up with a better way to sort these
                data.sort((a, b) => {
                    if (a.start_date < b.start_date) {
                        return 1
                    }
                    if (a.start_date > b.start_date) {
                        return -1
                    }
                    return 0
                })
                setTransactions(data)
            })
    }

    return (
        <>

            <EditTransaction open={editorOpen} onClose={() => { setEditorOpen(false) }} isNew={editIsNew} editData={editData}/>

            <Fab color="secondary" sx={{ position: "fixed", bottom: 96, right: 16, zIndex: 2 }} onClick={() => { setEditorOpen(true); setEditIsNew(true); setEditData(null) }}>
                <Add />
            </Fab>

            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", border: "none" }}>

                <HorizontalGroup style={{ gap: "10px" }}>
                    <ReceiptLong fontSize="large" />
                    <Typography variant="h4">Ledger</Typography>
                </HorizontalGroup>

                <VerticalGroup style={{ width: "100%", gap: "15px", }}>

                    <Card
                        title="$123"
                        subtitle="2023-06-10 12:34"
                        titleChip={<Chip variant="outlined" size="small" label="Colin" color="colin" />}
                        actions={<IconButton color="primary"><Edit /></IconButton>}
                        style={{ width: "100%" }}
                    >
                        <Typography variant="body1">
                            for Asian Court on Philly Trip
                        </Typography>
                    </Card>

                </VerticalGroup>

            </div>
        </>
    )
}