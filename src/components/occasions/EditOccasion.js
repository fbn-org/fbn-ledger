import { useState, useEffect } from 'react';

import { Dialog, Slide, useTheme, Typography, TextField, Tooltip, ToggleButtonGroup, ToggleButton, Button, IconButton, ClickAwayListener } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { DatePicker } from "@mui/x-date-pickers";
import { Delete, KeyboardDoubleArrowRight } from "@mui/icons-material";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import VerticalGroup from "../VerticalGroup";
import HorizontalGroup from "../HorizontalGroup";
import Drawer from '../Drawer';

export default function EditOccasion(props) {

    const theme = useTheme()

    const isNew = props.isNew
    const editData = props.editData
    const people = props.people

    const [saving, setSaving] = useState(false)
    const [confirmationOpen, setConfirmationOpen] = useState(false)

    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState(dayjs.utc().local())
    const [endDate, setEndDate] = useState(dayjs().utc().local().set('date', dayjs().utc().local().date() + 1))
    const [included, setIncluded] = useState([])

    function submit() {
        setSaving(true)
        let data = {
            name: name,
            start_date: startDate.utc(),
            end_date: endDate.utc(),
            included_people: included
        }

        if (isNew) {
            fetch("/api/occasions/createOccasion", {
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
            fetch(`/api/occasions/${editData._id}`, {
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

    function deleteOccasion() {
        fetch(`/api/occasions/${editData._id}`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then(data => {
                close()
            })
    }

    function close() {
        setName("")
        setStartDate(dayjs().local())
        setEndDate(dayjs().set('date', dayjs().date() + 1))
        setIncluded([])
        setSaving(false)
        setConfirmationOpen(false)
        props.onClose()
    }

    useEffect(() => {
        if (editData) {
            setName(editData.name)
            setStartDate(dayjs(editData.start_date))
            setEndDate(dayjs(editData.end_date))
            setIncluded(editData.included_people)
        }
    }, [editData])

    return (
        <Drawer title={isNew ? "New Occasion" : "Edit Occasion"} open={props.open} actions={!isNew ?
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
                    <IconButton color="secondary" onClick={() => confirmationOpen ? deleteOccasion() : setConfirmationOpen(true)}><Delete /></IconButton>
                </Tooltip>
            </ClickAwayListener> : null} >

            <VerticalGroup style={{ width: "100%", alignItems: "flex-start", gap: "15px" }}>
                <TextField label="Name" variant="outlined" size="medium" fullWidth value={name} onChange={(e) => setName(e.target.value)} />

                <HorizontalGroup style={{ width: "100%", alignItems: "flex-start", gap: "10px", alignItems: "center" }}>
                    <DatePicker slotProps={{ textField: { size: "medium" } }} label="Start date" value={startDate} onChange={(v) => setStartDate(v) } />
                    <KeyboardDoubleArrowRight />
                    <DatePicker slotProps={{ textField: { size: "medium" } }} label="End date" value={endDate} onChange={(v) => setEndDate(v)} minDate={startDate} />
                </HorizontalGroup>

                <ToggleButtonGroup
                    onChange={(e, v) => { setIncluded(v); console.log(v) }}
                    value={included}
                    fullWidth
                    size="medium"
                >
                    {people.map(person => {
                        return (
                            <ToggleButton key={person._id} value={person._id} color={person.name.toLowerCase()}>{person.name}</ToggleButton>
                        )
                    })}
                </ToggleButtonGroup>

                <HorizontalGroup style={{ width: "100%", gap: "10px", justifyContent: "space-evenly", marginTop: "10px" }}>
                    <Button variant="outlined" color="secondary" size="large" onClick={close} sx={{ width: "100%" }}>Cancel</Button>
                    <LoadingButton variant="outlined" color="primary" size="large" sx={{ width: "100%" }} onClick={submit} loading={saving} disabled={name === "" || included.length === 0}>Save</LoadingButton>
                </HorizontalGroup>

            </VerticalGroup>

        </Drawer>
    )
}