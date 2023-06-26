import { useState, useEffect } from "react"

import { Chip, IconButton, Typography } from "@mui/material"
import { Close, KeyboardDoubleArrowRight } from "@mui/icons-material"

import Drawer from "../Drawer.js"
import VerticalGroup from "../VerticalGroup.js"
import HorizontalGroup from "../HorizontalGroup.js"

export default function Payouts(props) {

    const occasion = props.occasion
    const people = props.people
    const setOpen = props.setOpen
    const open = props.open

    const [transactions, setTransactions] = useState([])
    const [owes, setOwes] = useState(null)

    useEffect(() => {
        if (occasion) {
            fetch(`/api/ledger/fetchTransactions/${occasion._id}`, {
                method: 'GET',
            })
                .then(res => res.json())
                .then(data => {
                    setTransactions(data)
                })
        }
    }, [occasion])

    useEffect(() => {
        processPayments(transactions)
    }, [transactions])

    function processPayments(transactions) {
        var owes = {}

        transactions.forEach(transaction => {
            let totals = {

            }

            let payer = transaction.payer
            let fullTotal = transaction.total
            let extra = 0
            if (transaction.tax !== "") {
                extra += parseFloat(transaction.tax)
            }
            if (transaction.tip !== "") {
                extra += parseFloat(transaction.tip)
            }
            fullTotal -= extra

            Object.keys(transaction.individual_items).forEach(personId => {
                let total = transaction.individual_items[personId].reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
                let weight = total / fullTotal
                totals[personId] = (total + (extra * weight)).toFixed(2)
            })

            Object.keys(totals).forEach(personId => {
                if (!owes[personId]) {
                    owes[personId] = {}
                }

                if (personId !== payer) {
                    if (owes[personId][payer]) {
                        owes[personId][payer] += parseFloat(totals[personId])
                    } else {
                        owes[personId][payer] = parseFloat(totals[personId])
                    }
                }
            })
        })

        // cross check everyone's owes and subtract any redundant costs
        Object.keys(owes).forEach(fromId => {
            Object.keys(owes[fromId]).forEach(toId => {
                if (owes[toId][fromId] && owes[fromId][toId]) {
                    if (owes[toId][fromId] > owes[fromId][toId]) {
                        owes[toId][fromId] -= owes[fromId][toId]
                        delete owes[fromId][toId]
                    } else {
                        owes[fromId][toId] -= owes[toId][fromId]
                        delete owes[toId][fromId]
                    }
                }
            })
        })

        console.log(owes)
        setOwes(owes)
    }

    function close() {
        setOpen(false)
        setOwes(null)
        setTransactions([])
        props.onClose()
    }

    return (
        <Drawer title="Payouts" subtitle={occasion ? occasion.name : ""} open={open && owes !== null} actions={<IconButton onClick={close} color="secondary"><Close /></IconButton>} >

            <VerticalGroup style={{ width: "100%", alignItems: "flex-start" }}>

                {
                    owes ? Object.keys(owes).map(fromId => {

                        if (Object.keys(owes[fromId]).length > 0) {

                            return (
                                <VerticalGroup key={fromId} style={{ width: "100%", gap: "15px", marginBottom: "15px" }}>
                                    {
                                        Object.keys(owes[fromId]).map(toId => {

                                            const fromName = people.find(person => person._id === fromId).name
                                            const toName = people.find(person => person._id === toId).name

                                            return (
                                                owes[fromId][toId] > 0 ?
                                                    <HorizontalGroup key={toId} style={{ width: "100%", gap: "5px", justifyContent: "center" }}>
                                                        <Chip label={fromName} color={fromName.toLowerCase()} variant="outlined" sx={{ flexBasis: "35%" }} />
                                                        <KeyboardDoubleArrowRight />
                                                        <Typography variant="h6" sx={{ flexBasis: "30%", textAlign: "center" }}>${owes[fromId][toId].toFixed(2)}</Typography>
                                                        <KeyboardDoubleArrowRight />
                                                        <Chip label={toName} color={toName.toLowerCase()} variant="outlined" sx={{ flexBasis: "35%" }} />
                                                    </HorizontalGroup>
                                                    : null

                                            )
                                        })
                                    }
                                </VerticalGroup>
                            )
                        } else return null

                    })
                        : null}

            </VerticalGroup>

        </Drawer>
    )
}