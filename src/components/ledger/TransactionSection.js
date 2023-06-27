import { useState } from "react"

import { Typography, IconButton, Collapse } from "@mui/material"
import { ExpandMore, ExpandLess } from "@mui/icons-material"

import VerticalGroup from "../util/VerticalGroup"
import HorizontalGroup from "../util/HorizontalGroup"

export default function TransactionSection(props) {

    const [open, setOpen] = useState(props.open || false)

    return (
        <VerticalGroup style={{ width: "100%", }}>
            <HorizontalGroup style={{ width: "100%", gap: "10px", marginBottom: "10px" }}>
                {props.icon}
                <Typography variant="h5">{props.title}</Typography>
                <HorizontalGroup style={{ width: "auto", flexGrow: 1, justifyContent: "flex-end" }}>
                    <IconButton color="secondary" size="medium" onClick={() => { setOpen(a => !a) }}>
                        {!open ? <ExpandMore /> : <ExpandLess />}
                    </IconButton>
                </HorizontalGroup>
            </HorizontalGroup>
            <Collapse in={open} style={{ width: "100%" }}>

                {props.children}

            </Collapse>
        </VerticalGroup>
    )
}