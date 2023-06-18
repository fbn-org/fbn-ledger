import { useState, useEffect } from 'react';

import { Divider, ToggleButton, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, InputAdornment, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Add, KeyboardDoubleArrowRight } from "@mui/icons-material";

import dayjs from 'dayjs';

import Drawer from "../Drawer";
import HorizontalGroup from "../HorizontalGroup";
import VerticalGroup from "../VerticalGroup";

export default function EditTransaction(props) {

    const isNew = props.isNew
    const editData = props.editData
    const people = props.people

    const [saving, setSaving] = useState(false)
    const [confirmationOpen, setConfirmationOpen] = useState(false)

    const [reason, setReason] = useState("")
    const [date, setDate] = useState(dayjs())

    return (
        <Drawer open={props.open} title="Edit Transaction">

            <TextField label="Reason" variant="outlined" size="medium" fullWidth value={reason} onChange={(e) => setReason(e.target.value)} />
            <HorizontalGroup style={{ width: "100%", gap: "10px" }}>
                <DatePicker slotProps={{ textField: { size: "medium", autoWidth: true } }} label="Date" views={['year', 'month', 'day']} value={date} onChange={(v) => {setDate(v)}} sx={{ flexBasis: "50%" }} />

                <FormControl sx={{ flexBasis: "50%" }}>
                    <InputLabel id="transaction-type-label">Occasion</InputLabel>
                    <Select variant="outlined" size="medium" label="Occasion">
                        <MenuItem>None</MenuItem>
                        <MenuItem>Philly trip</MenuItem>
                    </Select>
                </FormControl>
            </HorizontalGroup>

            <VerticalGroup style={{ width: "100%", gap: "15px", marginTop: "10px" }}>
                <HorizontalGroup style={{ width: "100%", gap: "5px" }}>
                    <Chip label="Colin" color="colin" variant="outlined" sx={{ flexBasis: "40%" }} />
                    <KeyboardDoubleArrowRight />
                    <TextField variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} />
                </HorizontalGroup>

                <HorizontalGroup style={{ width: "100%", gap: "5px", alignSelf: "flex-end", justifyContent: "flex-end", marginTop: "10px", }}>
                    <Typography variant="h6" sx={{ flexBasis: "40%", textAlign: "center" }}>Tax</Typography>
                    <Add />
                    <TextField variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} />
                </HorizontalGroup>

                <HorizontalGroup style={{ width: "100%", gap: "5px", alignSelf: "flex-end", justifyContent: "flex-end" }}>
                    <Typography variant="h6" sx={{ flexBasis: "40%", textAlign: "center" }}>Tip</Typography>
                    <Add />
                    <TextField label="18%: $10.24, 20%: $13.12" variant="outlined" size="small" type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ flexBasis: "60%" }} />
                </HorizontalGroup>
            </VerticalGroup>

            <Divider sx={{ width: "60%", alignSelf: "flex-end" }} />

            <HorizontalGroup style={{ width: "100%", gap: "5px", alignSelf: "flex-end", justifyContent: "flex-end" }}>
                <Typography variant="h6" sx={{ flexBasis: "40%", textAlign: "center" }}>Total</Typography>
                <KeyboardDoubleArrowRight />
                <Typography variant="h5" sx={{ flexBasis: "60%", textAlign: "left", paddingLeft: "5px" }}>$123.45</Typography>
            </HorizontalGroup>

            <HorizontalGroup style={{ width: "100%", gap: "10px", justifyContent: "space-evenly", marginTop: "10px" }}>
                <Button variant="outlined" color="secondary" size="large" onClick={props.onClose} sx={{ width: "100%" }}>Cancel</Button>
                <Button variant="outlined" color="primary" size="large" sx={{ width: "100%" }}>Save</Button>
            </HorizontalGroup>

        </Drawer >
    )
}