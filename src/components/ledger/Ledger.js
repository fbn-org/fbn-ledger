import { useState } from "react"

import { Chip, IconButton, Typography, Fab } from "@mui/material"
import { Edit, LocalAtm, ReceiptLong, Add } from "@mui/icons-material"

import Card from "../Card"
import HorizontalGroup from "../HorizontalGroup"
import VerticalGroup from "../VerticalGroup"
import EditTransaction from "./EditTransaction"

export default function Ledger(props) {

    const [editorOpen, setEditorOpen] = useState(false)

    return (
        <>

            <EditTransaction open={editorOpen} onClose={() => { setEditorOpen(false) }} />

            <Fab color="secondary" sx={{ position: "fixed", bottom: 96, right: 16, zIndex: 2 }} onClick={() => { setEditorOpen(true) }}>
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