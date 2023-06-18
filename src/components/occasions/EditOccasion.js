import { useState, useEffect } from 'react';

import { Dialog, Slide, useTheme, Typography, TextField, Divider, ToggleButtonGroup, ToggleButton, Button, IconButton } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { DatePicker } from "@mui/x-date-pickers";
import { Delete, KeyboardDoubleArrowRight } from "@mui/icons-material";

import dayjs from 'dayjs';

import VerticalGroup from "../VerticalGroup";
import HorizontalGroup from "../HorizontalGroup";
import Drawer from '../Drawer';

export default function EditOccasion(props) {

    const theme = useTheme()
    const isNew = props.isNew

    const [people, setPeople] = useState([])
    const [saving, setSaving] = useState(false)

    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState(dayjs())
    const [endDate, setEndDate] = useState()
    const [included, setIncluded] = useState([])

    useEffect(() => {
        fetch("/api/fetchPeople")
            .then(res => res.json())
            .then(data => {
                setPeople(data)
            })
    }, [])

    function submit() {
        setSaving(true)
        let data = {
            name: name,
            start_date: startDate.format("YYYY-MM-DD"),
            end_date: endDate.format("YYYY-MM-DD"),
            included_people: included
        }
        fetch("/api/createOccasion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                setSaving(false)
                props.onClose()
            })
    }

    useEffect(() => {
        console.log(included)
    }, [included])

    return (
        <Drawer title={isNew ? "New Occasion" : "Edit Occasion"} open={props.open} actions={!isNew ? <IconButton color="secondary"><Delete /></IconButton> : null} >

            <VerticalGroup style={{ width: "100%", alignItems: "flex-start", gap: "15px" }}>
                <TextField label="Name" variant="outlined" size="medium" fullWidth value={name} onChange={(e) => setName(e.target.value)} />

                <HorizontalGroup style={{ width: "100%", alignItems: "flex-start", gap: "10px", alignItems: "center" }}>
                    <DatePicker slotProps={{ textField: { size: "medium" } }} label="Start date" value={startDate} onChange={(v) => setStartDate(v)}/>
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
                    <Button variant="outlined" color="secondary" size="large" onClick={props.onClose} sx={{ width: "100%" }}>Cancel</Button>
                    <LoadingButton variant="outlined" color="primary" size="large" sx={{ width: "100%" }} onClick={submit} loading={saving}>Save</LoadingButton>
                </HorizontalGroup>

            </VerticalGroup>

        </Drawer>
    )
}