import { useState, useEffect, useCallback } from 'react';

import { Divider, Avatar, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Icon, InputAdornment, Typography, IconButton, ClickAwayListener, Tooltip, Collapse, OutlinedInput, AvatarGroup } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from "@mui/x-date-pickers";
import { Add, Delete, ExpandLess, ExpandMore, KeyboardDoubleArrowRight } from "@mui/icons-material";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import Drawer from "../Drawer";
import HorizontalGroup from "../HorizontalGroup";
import VerticalGroup from "../VerticalGroup";

function PersonItem(props) {

    const personId = props.personId
    const name = props.name
    const individualAmounts = props.individualAmounts
    const setIndividualAmounts = props.setIndividualAmounts

    // useEffect(() => {
    //     if (individualAmounts[personId] === undefined) {
    //         setIndividualAmounts(individualAmounts => ({ ...individualAmounts, [personId]: [""] }))
    //     }
    // }, [])

    useEffect(() => {
        if (individualAmounts[personId] !== undefined) {

            if (individualAmounts[personId].every(amount => amount !== "")) {
                setIndividualAmounts(individualAmounts => ({ ...individualAmounts, [personId]: [...individualAmounts[personId], ""] }))
            }

            if (individualAmounts[personId].some(amount => amount === "")) {
                const emptyIndex = individualAmounts[personId].findIndex(amount => amount === "")
                if (emptyIndex !== individualAmounts[personId].length - 1) {
                    setIndividualAmounts(individualAmounts => ({ ...individualAmounts, [personId]: [...individualAmounts[personId].slice(0, emptyIndex), ...individualAmounts[personId].slice(emptyIndex + 1)] }))
                }
            }
        }
    }, [individualAmounts, personId, setIndividualAmounts])

    return (
        <>
            {individualAmounts[personId] !== undefined ?
                <VerticalGroup key={personId} style={{ width: " 100%", gap: "10px" }}>

                    <HorizontalGroup style={{ width: "100%", gap: "5px" }}>
                        <Chip label={name} color={name.toLowerCase()} variant="outlined" sx={{ flexBasis: "40%" }} />
                        <KeyboardDoubleArrowRight />
                        <TextField variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} value={individualAmounts[personId][0]} onChange={(e) => { setIndividualAmounts(individualAmounts => ({ ...individualAmounts, [personId]: [e.target.value, ...individualAmounts[personId].slice(1)] })) }} />
                    </HorizontalGroup>

                    {individualAmounts[personId].slice(1).map((amount, index) => {
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
                                <TextField variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} value={individualAmounts[personId][id]} onChange={(e) => { console.log(individualAmounts[personId].slice(0, id)); setIndividualAmounts(individualAmounts => ({ ...individualAmounts, [personId]: [...individualAmounts[personId].slice(0, id), e.target.value, ...individualAmounts[personId].slice(id + 1)] })) }} />
                            </HorizontalGroup>
                        )
                    })}


                </VerticalGroup>
                : null}
        </>
    )
}

function SharedItem(props) {

    const people = props.people
    const sharedAmounts = props.sharedAmounts
    const setSharedAmounts = props.setSharedAmounts
    const sharedItem = props.sharedItem
    const index = props.index

    function updatePeople(event) {
        const {
            target: { value },
        } = event
        let selectedPeople = typeof value === 'string' ? value.split(',') : value
        setSharedAmounts(old => {
            let o = [...old]
            o[index] = { people: selectedPeople, amount: sharedAmounts[index].amount }
            return o
        })
    }

    function updateAmount(e) {
        setSharedAmounts(old => {
            let o = [...old]
            o[index] = { people: sharedAmounts[index].people, amount: e.target.value }
            return o   
        })
    }

    return (
        <HorizontalGroup style={{ width: "100%", gap: "5px" }}>
            <FormControl size="small" sx={{ flexBasis: "40%" }}>
                <InputLabel id="demo-multiple-name-label">People</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    label="People"
                    multiple
                    value={sharedAmounts[index].people}
                    onChange={updatePeople}
                    renderValue={(selected) => (
                        <HorizontalGroup style={{ justifyContent: "flex-start", width: "100%" }}>
                            <AvatarGroup spacing="small">
                                {selected.map((value) => {
                                    let person = people.find(p => p.id === value)
                                    return person ? <Avatar sx={{ bgcolor: `${person.name.toLowerCase()}.main`, width: 18, height: 18 }} key={value}><Icon /></Avatar> : null
                                })}
                            </AvatarGroup>
                        </HorizontalGroup>
                    )}
                >
                    {people.map(person => {
                        return (
                            <MenuItem key={person.id} value={person.id} sx={{ gap: "5px" }}>
                                <Avatar sx={{ bgcolor: `${person.name.toLowerCase()}.main`, width: 20, height: 20 }}><Icon /></Avatar>
                                {person.name}
                            </MenuItem>
                        )
                    })}

                </Select>
            </FormControl>
            <KeyboardDoubleArrowRight />
            <TextField variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} value={sharedAmounts[index].amount} onChange={updateAmount} />

        </HorizontalGroup>
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

    const [individualAmounts, setIndividualAmounts] = useState({})
    const [sharedAmounts, setSharedAmounts] = useState([])
    const [reason, setReason] = useState("")
    const [userPaying, setUserPaying] = useState("")

    const [date, setDate] = useState(dayjs().utc().local())
    const [occasion, setOccasion] = useState("None")
    const [tax, setTax] = useState("")
    const [tip, setTip] = useState("")

    const [currentOccasion, setCurrentOccasion] = useState(null)
    const [currentPeople, setCurrentPeople] = useState([])

    function submit() {
        setSaving(true)

        let amountsFinal = individualAmounts
        let sharedFinal = sharedAmounts
        //delete the empty item in each person's array
        Object.keys(amountsFinal).forEach(personId => {
            amountsFinal[personId] = amountsFinal[personId].filter(amount => amount !== "")
            amountsFinal[personId].forEach((amount, index) => {
                amountsFinal[personId][index] = parseFloat(amount).toFixed(2)
            })
        })
        //delete the empty item in each shared array
        sharedFinal = sharedFinal.filter(item => item.amount !== "" && item.people.length !== 0)
        sharedFinal.forEach((item, index) => {
            sharedFinal[index].amount = parseFloat(item.amount).toFixed(2)
        })

        let data = {
            reason: reason,
            date: date.utc(),
            payer: userPaying,
            occasion: occasion,
            tax: tax,
            tip: tip,
            individual_items: amountsFinal,
            shared_items: sharedFinal,
            total: total.toFixed(2),
        }

        console.log(data)

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

    useEffect(() => {
        // add up all individualAmounts
        let newTotal = 0

        if (individualAmounts) {
            if (Object.keys(individualAmounts).length > 0) {
                let subtotal = 0
                Object.keys(individualAmounts).forEach(personId => {
                    individualAmounts[personId].forEach(amount => {
                        if (amount !== "") {
                            subtotal += parseFloat(amount)
                        }
                    })
                })

                newTotal += subtotal
            }
        }

        if (sharedAmounts) {
            if (sharedAmounts.length > 0) {
                let subtotal = 0
                sharedAmounts.forEach(item => {
                    if (item.amount !== "") {
                        subtotal += parseFloat(item.amount)
                    }
                })

                newTotal += subtotal
            }
        }

        setSubtotal(newTotal)
    }, [individualAmounts, sharedAmounts])

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

    const presetValues = useCallback((occasion, unfixedIndividualAmounts, unfixedSharedAmounts) => {
        var occasionFromId = occasions.find(o => o._id == occasion)
        var peopleForOccasion = []
        var peopleUnformattedForOccasion = []

        if (occasionFromId) {
            peopleUnformattedForOccasion = occasionFromId.included_people
        } else {
            for (const index in people) {
                let peopleInfo = people[index]
                peopleUnformattedForOccasion.push(peopleInfo._id)
            }
        }

        // Format personal info from table of users
        for (const index in peopleUnformattedForOccasion) {
            let personId = peopleUnformattedForOccasion[index]
            let personInfo = people.find(user => user._id === personId)

            if (personInfo) {
                let info = {
                    "id": personId,
                    "name": personInfo.name,
                }
                peopleForOccasion.push(info)
            }
        }

        var newIndividualAmounts = {}
        var newSharedAmounts = []

        if (peopleForOccasion.length !== 0) {
            // make sure everyone in individualAmounts is actually in the occasion
            if (peopleForOccasion !== null) {
                peopleForOccasion.forEach(person => {
                    newIndividualAmounts[person.id] = [""]
                })

                if (unfixedIndividualAmounts) {
                    for (const personId of Object.keys(unfixedIndividualAmounts)) {
                        let targetPerson = peopleForOccasion.find(user => user.id === personId)
                        if (targetPerson) {
                            newIndividualAmounts[personId] = unfixedIndividualAmounts[personId]
                        }
                    }
                }

                if (unfixedSharedAmounts) {
                    for (const item of unfixedSharedAmounts) {
                        let newSharedItem = {
                            "people": [],
                            "amount": ""
                        }
                        for (const personId of item.people) {
                            let targetPerson = peopleForOccasion.find(user => user.id === personId)
                            if (targetPerson) {
                                newSharedItem.people.push(personId)
                            }
                        }
                        newSharedItem.amount = item.amount
                        newSharedAmounts.push(newSharedItem)
                    }
                } else {
                    newSharedAmounts = [{
                        "people": [],
                        "amount": ""
                    }]
                }
            }
        }

        console.log(newSharedAmounts)

        setOccasion(occasion)
        setIndividualAmounts(newIndividualAmounts)
        setSharedAmounts(newSharedAmounts)
        setCurrentOccasion(occasionFromId)
        setCurrentPeople(peopleForOccasion)
    }, [occasions, people])

    useEffect(() => {
        if (sharedAmounts.length > 0) {
            if (sharedAmounts.every(item => item.amount !== "" && item.people.length !== 0)) {
                console.log("extending")
                setSharedAmounts(old => [...old, { "people": [], "amount": "" }])
            }

            if (sharedAmounts.some(item => item.amount === "" && item.people.length === 0)) {
                const emptyIndex = sharedAmounts.findIndex(item => item.amount === "" && item.people.length === 0)
                if (emptyIndex !== sharedAmounts.length - 1) {
                    console.log("Deleting")
                    console.log(sharedAmounts)
                    setSharedAmounts(old => [...old.slice(0, emptyIndex), ...old.slice(emptyIndex + 1)])
                }
            }
        }
    }, [sharedAmounts])

    useEffect(() => {
        console.log(sharedAmounts)
    }, [sharedAmounts])

    function close() {
        props.onClose()
        setReason("")
        setDate(dayjs())
        setTax("")
        setTip("")
        setUserPaying("")
        setTotal(0)
        setSubtotal(0)
        setConfirmationOpen(false)
        setSaving(false)

        presetValues("None")
    }

    useEffect(() => {
        presetValues("None")
    }, [presetValues])

    useEffect(() => {
        if (editData) {
            console.log(editData)
            setReason(editData.reason)
            setDate(dayjs(editData.date))
            setTax(editData.tax)
            setTip(editData.tip)
            setUserPaying(editData.payer)

            presetValues(editData.occasion, editData.individual_items, editData.shared_items)
        }
    }, [editData, presetValues])

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


            <TransactionSection title="Metadata" open>
                <VerticalGroup style={{ width: "100%", gap: "20px", marginTop: "5px" }}>
                    <HorizontalGroup style={{ width: "100%", gap: "10px" }}>
                        <TextField label="Description" variant="outlined" size="medium" fullWidth value={reason} onChange={(e) => setReason(e.target.value)} sx={{ flexBasis: "50%" }} />

                        <FormControl sx={{ flexBasis: "50%" }}>
                            <InputLabel id="payer-label">Payer</InputLabel>
                            <Select variant="outlined" size="medium" label="Buyer" value={userPaying} onChange={(selectionEntry) => {
                                var userPaying = selectionEntry.target.value
                                setUserPaying(userPaying)
                            }}>
                                {currentPeople.map(personInfo => {
                                    return (
                                        <MenuItem key={personInfo.id} value={personInfo.id}>{personInfo.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </HorizontalGroup>

                    <HorizontalGroup style={{ width: "100%", gap: "10px" }}>
                        <DateTimePicker slotProps={{ textField: { size: "medium" } }} label="Time" value={date} onChange={(v) => { setDate(v) }} sx={{ flexBasis: "50%" }} />

                        <FormControl sx={{ flexBasis: "50%" }}>
                            <InputLabel id="transaction-type-label">Occasion</InputLabel>
                            <Select variant="outlined" size="medium" label="Occasion" value={occasion} onChange={(selectionEntry) => {
                                var selectionValue = selectionEntry.target.value
                                presetValues(selectionValue, individualAmounts, sharedAmounts)
                            }}>
                                <MenuItem key="None" value="None">None</MenuItem>
                                {editData?.occasion ? <MenuItem key={editData.occasion} value={editData.occasion}>{occasions.find(o => o._id === editData.occasion).name}</MenuItem> : null}
                                {occasions.map(occasion => {
                                    if (occasion.timeState === "active") {
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
                </VerticalGroup>
            </TransactionSection>


            <TransactionSection title="Individual items">
                <VerticalGroup style={{ width: "100%", gap: "20px", marginTop: "5px" }}>

                    {individualAmounts ? currentPeople.map(personInfo => {
                        return (
                            <PersonItem key={personInfo.id} personId={personInfo.id} name={personInfo.name} individualAmounts={individualAmounts} setIndividualAmounts={setIndividualAmounts} />
                        )
                    })
                        : null}

                </VerticalGroup>
            </TransactionSection>

            <TransactionSection title="Shared items">
                <VerticalGroup style={{ width: "100%", gap: "20px", marginTop: "5px" }}>
                    {sharedAmounts && sharedAmounts.length > 0 ? sharedAmounts.map((sharedItem, index) => {
                        return (
                            <SharedItem key={index} index={index} people={currentPeople} sharedItem={sharedItem} sharedAmounts={sharedAmounts} setSharedAmounts={setSharedAmounts} />
                        )
                    })
                        : null}
                </VerticalGroup>
            </TransactionSection>

            {/* <TransactionSection title="Tax and tip"> */}
            <VerticalGroup style={{ width: "100%", gap: "20px", marginTop: "10px" }}>
                <HorizontalGroup style={{ width: "100%", gap: "5px", alignSelf: "flex-end", justifyContent: "flex-end" }}>
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
            {/* </TransactionSection> */}

            <Divider sx={{ width: "60%", alignSelf: "flex-end" }} />

            <HorizontalGroup style={{ width: "100%", gap: "5px", alignSelf: "flex-end", justifyContent: "flex-end" }}>
                <Typography variant="h6" sx={{ flexBasis: "40%", textAlign: "center" }}>Total</Typography>
                <KeyboardDoubleArrowRight />
                <Typography variant="h5" sx={{ flexBasis: "60%", textAlign: "left", paddingLeft: "5px" }}>${total.toFixed(2)}</Typography>
            </HorizontalGroup>

            <HorizontalGroup style={{ width: "100%", gap: "10px", justifyContent: "space-evenly", marginTop: "10px" }}>
                <Button variant="outlined" color="secondary" size="large" onClick={close} sx={{ width: "100%" }}>Cancel</Button>
                <LoadingButton variant="outlined" color="primary" size="large" sx={{ width: "100%" }} onClick={submit} loading={saving} disabled={reason === "" || total === 0 || subtotal === 0 || occasion === "" || userPaying === ""}>Save</LoadingButton>
            </HorizontalGroup>

        </Drawer >
    )
}

function TransactionSection(props) {

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