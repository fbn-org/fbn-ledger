import { useState, useEffect } from 'react';

import { Dialog, Slide, useTheme, Typography, TextField, Divider, ToggleButtonGroup, ToggleButton, Button, IconButton } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";
import { Delete, KeyboardDoubleArrowRight } from "@mui/icons-material";

import VerticalGroup from "../VerticalGroup";
import HorizontalGroup from "../HorizontalGroup";
import Drawer from '../Drawer';

export default function EditOccasion(props) {

    const theme = useTheme()

    const [included, setIncluded] = useState([])

    return (
        <Drawer title="New Occasion" open={props.open} actions={<IconButton color="secondary"><Delete /></IconButton>} >

            <VerticalGroup style={{ width: "100%", alignItems: "flex-start", gap: "15px" }}>
                <TextField label="Name" variant="outlined" size="medium" fullWidth />

                <HorizontalGroup style={{ width: "100%", alignItems: "flex-start", gap: "10px", alignItems: "center" }}>
                    <DatePicker slotProps={{ textField: { size: "medium" } }} label="Start date" />
                    <KeyboardDoubleArrowRight />
                    <DatePicker slotProps={{ textField: { size: "medium" } }} label="End date" />
                </HorizontalGroup>

                <ToggleButtonGroup
                    onChange={(e, v) => setIncluded(v)}
                    value={included}
                    fullWidth
                    size="medium"
                >
                    <ToggleButton value="colin" color="colin">Colin</ToggleButton>
                    <ToggleButton value="eric" color="eric">Eric</ToggleButton>
                    <ToggleButton value="matty" color="matty">Matty</ToggleButton>
                    <ToggleButton value="hudson" color="hudson">Hudson</ToggleButton>
                </ToggleButtonGroup>

                <HorizontalGroup style={{ width: "100%", gap: "10px", justifyContent: "space-evenly", marginTop: "10px" }}>
                    <Button variant="outlined" color="secondary" size="large" onClick={props.onClose} sx={{ width: "100%" }}>Cancel</Button>
                    <Button variant="outlined" color="primary" size="large" sx={{ width: "100%" }}>Save</Button>
                </HorizontalGroup>

            </VerticalGroup>

        </Drawer>
    )
}