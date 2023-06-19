import { useState, useEffect } from 'react';

import { Divider, Avatar, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, InputAdornment, Typography, IconButton, ClickAwayListener, Tooltip } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from "@mui/x-date-pickers";
import { Add, Delete, ExpandLess, ExpandMore, KeyboardDoubleArrowRight } from "@mui/icons-material";

import dayjs from 'dayjs';

import Drawer from "../Drawer";
import HorizontalGroup from "../HorizontalGroup";
import VerticalGroup from "../VerticalGroup";

function PersonItem(props) {

    const personId = props.personId
    const name = props.name
    const amounts = props.amounts
    const setAmounts = props.setAmounts

    useEffect(() => {
        if (amounts[personId] === undefined) {
            setAmounts(amounts => ({ ...amounts, [personId]: [""] }))
        }
    }, [])

    useEffect(() => {
        if (amounts[personId] !== undefined) {

            if (amounts[personId].every(amount => amount !== "")) {
                setAmounts(amounts => ({ ...amounts, [personId]: [...amounts[personId], ""] }))
            }

            if (amounts[personId].some(amount => amount === "")) {
                const emptyIndex = amounts[personId].findIndex(amount => amount === "")
                if (emptyIndex !== amounts[personId].length - 1) {
                    setAmounts(amounts => ({ ...amounts, [personId]: [...amounts[personId].slice(0, emptyIndex), ...amounts[personId].slice(emptyIndex + 1)] }))
                }
            }
        }

    }, [amounts[personId]])

    return (
        <>
            {amounts[personId] !== undefined ?
                <VerticalGroup key={personId} style={{ width: " 100%", gap: "10px" }}>

                    <HorizontalGroup key={0} style={{ width: "100%", gap: "5px" }}>
                        <Chip label={name} color={name.toLowerCase()} variant="outlined" sx={{ flexBasis: "40%" }} />
                        <KeyboardDoubleArrowRight />
                        <TextField variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} value={amounts[personId][0]} onChange={(e) => { setAmounts(amounts => ({ ...amounts, [personId]: [e.target.value, ...amounts[personId].slice(1)] })) }} />
                    </HorizontalGroup>

                    {amounts[personId].slice(1).map((amount, index) => {
                        const id = index + 1
                        return (
                            <HorizontalGroup key={id} style={{ width: "100%", gap: "5px" }}>
                                <div style={{ flexBasis: "40%" }}>
                                    {/* {id === 1 ?
                                <>
                                    <Typography variant="subtitle2" color={`${name.toLowerCase()}.main`} sx={{ textAlign: "center" }} >${total}</Typography>
                                </>
                                : null} */}
                                </div>
                                <Add />
                                <TextField variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} value={amounts[personId][id]} onChange={(e) => { console.log(amounts[personId].slice(0, id)); setAmounts(amounts => ({ ...amounts, [personId]: [...amounts[personId].slice(0, id), e.target.value, ...amounts[personId].slice(id + 1)] })) }} />
                            </HorizontalGroup>
                        )
                    })}


                </VerticalGroup>
                : null}
        </>
    )
}

export default function EditTransaction(props) {

    const isNew = props.isNew
    const editData = props.editData
    const people = props.people
    const occasions = props.occasions

    const [saving, setSaving] = useState(false)
    const [confirmationOpen, setConfirmationOpen] = useState(false)

    const [total, setTotal] = useState(0)
    const [subtotal, setSubtotal] = useState(0)

    const [amounts, setAmounts] = useState({})
    const [reason, setReason] = useState("")
    const [date, setDate] = useState(dayjs())
    const [occasion, setOccasion] = useState("")
    const [tax, setTax] = useState("")
    const [tip, setTip] = useState("")

    useEffect(() => {
        // add up all amounts
        if (Object.keys(amounts).length > 0) {
            let subtotal = 0
            Object.keys(amounts).forEach(personId => {
                amounts[personId].forEach(amount => {
                    if (amount !== "") {
                        subtotal += parseFloat(amount)
                    }
                })
            })

            setSubtotal(subtotal)
        }
    }, [amounts])

    useEffect(() => {
        let total = subtotal

        if (tax !== "") {
            total += parseFloat(tax)
        }
        if (tip !== "") {
            total += parseFloat(tip)
        }

        setTotal(total)
    }, [tax, tip, subtotal])

    useEffect(() => {
        // make sure everyone in amounts is actually in the occasion
        if (occasion !== "None" && Object.keys(amounts).length > 0) {
            var newKeys = []
            for (const personId of Object.keys(amounts)) {
                if (!occasions.find(o => o._id === occasion).included_people.includes(personId)) {
                    newKeys.push(personId)
                }
            }

            if (newKeys.length > 0) {
                setAmounts(amounts => {
                    const newAmounts = { ...amounts }
                    newKeys.forEach(key => {
                        delete newAmounts[key]
                    })
                    return newAmounts
                })
            }
        }
    }, [occasion])

    function submit() {
        setSaving(true)

        let amountsFinal = amounts
        //delete the empty item in each person's array
        Object.keys(amountsFinal).forEach(personId => {
            amountsFinal[personId] = amountsFinal[personId].filter(amount => amount !== "")
        })

        let data = {
            reason: reason,
            date: date.format("YYYY-MM-DD"),
            payer: "648e4ce5943894b71a1c60a3", // change this to whoever the current user is via a context eventually
            occasion: occasion,
            type: "split",
            type_attrs: {
                tax: tax,
                tip: tip,
                people_items: amountsFinal,
            },
            total: total,
        }

        if (isNew) {
            fetch("/api/ledger/createTransaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    close()
                })
        } else {
            fetch(`/api/ledger/${editData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...data,
                })
            })
                .then(res => res.json())
                .then(data => {
                    close()
                })
        }
    }

    function deleteTransaction() {
        console.log("deleting")
        fetch(`/api/ledger/${editData._id}`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then(data => {
                close()
            })
    }

    function close() {
        setReason("")
        setDate(dayjs())
        setAmounts({})
        setOccasion("")
        setTax("")
        setTip("")
        setTotal(0)
        setSubtotal(0)
        setSaving(false)
        setConfirmationOpen(false)
        props.onClose()
    }

    useEffect(() => {
        if (editData) {
            setReason(editData.reason)
            setDate(dayjs(editData.date))
            setOccasion(editData.occasion)
            setTax(editData.type_attrs.tax)
            setTip(editData.type_attrs.tip)
            setAmounts(editData.type_attrs.people_items)
        }
    }, [editData])

    return (
        <Drawer open={props.open} title={isNew ? "New Transaction" : "Edit Transaction"} actions={!isNew ?
            <ClickAwayListener onClickAway={() => setConfirmationOpen(false)}>
                <Tooltip
                    arrow
                    PopperProps={{
                        disablePortal: true,
                    }}
                    onClose={() => setConfirmationOpen(false)}
                    open={confirmationOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title="Tap again to confirm deletion"
                >
                    <IconButton color="secondary" onClick={() => confirmationOpen ? deleteTransaction() : setConfirmationOpen(true)}><Delete /></IconButton>
                </Tooltip>
            </ClickAwayListener> : null} >

            <TextField label="Reason" variant="outlined" size="medium" fullWidth value={reason} onChange={(e) => setReason(e.target.value)} />
            <HorizontalGroup style={{ width: "100%", gap: "10px" }}>
                <DateTimePicker slotProps={{ textField: { size: "medium", autoWidth: true } }} label="Date" value={date} onChange={(v) => { setDate(v) }} sx={{ flexBasis: "50%" }} />

                <FormControl sx={{ flexBasis: "50%" }}>
                    <InputLabel id="transaction-type-label">Occasion</InputLabel>
                    <Select variant="outlined" size="medium" label="Occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                        <MenuItem key="None" value="None">None</MenuItem>
                        {occasions.map(occasion => {
                            if (occasion.active) {
                                return (
                                    <MenuItem key={occasion._id} value={occasion._id}>{occasion.name}</MenuItem>
                                )
                            } else {
                                return null
                            }
                        })}
                    </Select>
                </FormControl>
            </HorizontalGroup>

            <VerticalGroup style={{ width: "100%", gap: "20px", marginTop: "10px" }}>

                {
                    occasion !== "None" && occasion !== "" ? occasions.find(o => o._id === occasion).included_people.map(personId => {
                        const name = people.find(person => person._id === personId).name
                        return (
                            <PersonItem key={personId} personId={personId} name={name} amounts={amounts} setAmounts={setAmounts} />
                        )
                    })
                        : occasion === "None" ? people.map(person => {
                            return (
                                <PersonItem key={person._id} personId={person._id} name={person.name} amounts={amounts} setAmounts={setAmounts} />
                            )
                        })
                            : null
                }

                <HorizontalGroup style={{ width: "100%", gap: "5px", alignSelf: "flex-end", justifyContent: "flex-end", marginTop: "10px", }}>
                    <Typography variant="h6" sx={{ flexBasis: "40%", textAlign: "center" }}>Tax</Typography>
                    <Add />
                    <TextField variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} value={tax} onChange={(e) => { setTax(e.target.value) }} />
                </HorizontalGroup>

                <HorizontalGroup style={{ width: "100%", gap: "5px", alignSelf: "flex-end", justifyContent: "flex-end" }}>
                    <Typography variant="h6" sx={{ flexBasis: "40%", textAlign: "center" }}>Tip</Typography>
                    <Add />
                    <TextField label={`18%: $${(subtotal * .18).toFixed(2)}, 20%: $${(subtotal * .2).toFixed(2)}`} variant="outlined" size="small" type="number" value={tip} onChange={(e) => { setTip(e.target.value) }} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} />
                </HorizontalGroup>
            </VerticalGroup>

            <Divider sx={{ width: "60%", alignSelf: "flex-end" }} />

            <HorizontalGroup style={{ width: "100%", gap: "5px", alignSelf: "flex-end", justifyContent: "flex-end" }}>
                <Typography variant="h6" sx={{ flexBasis: "40%", textAlign: "center" }}>Total</Typography>
                <KeyboardDoubleArrowRight />
                <Typography variant="h5" sx={{ flexBasis: "60%", textAlign: "left", paddingLeft: "5px" }}>${total.toFixed(2)}</Typography>
            </HorizontalGroup>

            <HorizontalGroup style={{ width: "100%", gap: "10px", justifyContent: "space-evenly", marginTop: "10px" }}>
                <Button variant="outlined" color="secondary" size="large" onClick={close} sx={{ width: "100%" }}>Cancel</Button>
                <LoadingButton variant="outlined" color="primary" size="large" sx={{ width: "100%" }} onClick={submit} loading={saving} disabled={reason === "" || total === 0 || subtotal === 0 || occasion === ""}>Save</LoadingButton>
            </HorizontalGroup>

        </Drawer >
    )
}