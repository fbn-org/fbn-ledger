import { useEffect, useState } from 'react';

import {
    Avatar,
    Button,
    Chip,
    ClickAwayListener,
    Dialog,
    FormControl,
    Icon,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    TextField,
    ToggleButton,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';

import { Delete, KeyboardDoubleArrowRight } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import request from '@/components/util/API.js';

import Drawer from '../util/Drawer';
import HorizontalGroup from '../util/HorizontalGroup';
import VerticalGroup from '../util/VerticalGroup';

dayjs.extend(utc);

export default function EditOccasion(props) {
    const theme = useTheme();

    const isNew = props.isNew;
    const editData = props.editData;
    const people = props.people;

    const [saving, setSaving] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(dayjs.utc().local());
    const [endDate, setEndDate] = useState(
        dayjs()
            .utc()
            .local()
            .set('date', dayjs().utc().local().date() + 1)
    );
    const [includedPeople, setIncludedPeople] = useState([]);

    function submit() {
        setSaving(true);
        let data = {
            name: name,
            start_date: startDate.startOf('day').utc(),
            end_date: endDate.endOf('day').utc(),
            included_people: includedPeople
        };

        if (isNew) {
            request('/api/occasions/createOccasion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
                .then((data) => {
                    close();
                });
        } else {
            request(`/api/occasions/${editData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    close();
                });
        }
    }

    function deleteOccasion() {
        request(`/api/occasions/disconnectTransactions/${editData._id}`, {
            method: 'PUT'
        });

        request(`/api/occasions/${editData._id}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then((data) => {
                close();
            });
    }

    function close() {
        setName('');
        setStartDate(dayjs().local());
        setEndDate(
            dayjs()
                .utc()
                .local()
                .set('date', dayjs().utc().local().date() + 1)
        );
        setIncludedPeople([]);
        setSaving(false);
        setConfirmationOpen(false);
        props.onClose();
    }

    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setStartDate(dayjs(editData.start_date));
            setEndDate(dayjs(editData.end_date));
            setIncludedPeople(editData.included_people);
        }
    }, [editData]);

    return (
        <Drawer
            title={isNew ? 'New Occasion' : 'Edit Occasion'}
            open={props.open}
            actions={
                !isNew ? (
                    <ClickAwayListener onClickAway={() => setConfirmationOpen(false)}>
                        <Tooltip
                            arrow
                            PopperProps={{
                                disablePortal: true
                            }}
                            onClose={() => setConfirmationOpen(false)}
                            open={confirmationOpen}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title="Tap again to confirm deletion"
                        >
                            <IconButton
                                color="secondary"
                                onClick={() => (confirmationOpen ? deleteOccasion() : setConfirmationOpen(true))}
                            >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </ClickAwayListener>
                ) : null
            }
        >
            <VerticalGroup style={{ width: '100%', alignItems: 'flex-start', gap: '15px' }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    size="medium"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <HorizontalGroup
                    style={{
                        width: '100%',
                        alignItems: 'flex-start',
                        gap: '10px',
                        alignItems: 'center'
                    }}
                >
                    <DatePicker
                        slotProps={{ textField: { size: 'medium' } }}
                        sx={{ width: '100%' }}
                        label="Start date"
                        value={startDate}
                        onChange={(v) => setStartDate(v)}
                    />
                    <KeyboardDoubleArrowRight />
                    <DatePicker
                        slotProps={{ textField: { size: 'medium' } }}
                        sx={{ width: '100%' }}
                        label="End date"
                        value={endDate}
                        onChange={(v) => setEndDate(v)}
                        minDate={startDate}
                    />
                </HorizontalGroup>

                <FormControl
                    fullWidth
                    sx={{ height: 65 }}
                >
                    <InputLabel id="demo-multiple-name-label">People</InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        label="People"
                        multiple
                        value={includedPeople}
                        onChange={(e) => {
                            let value = e.target.value;
                            setIncludedPeople(typeof value === 'string' ? value.split(',') : value);
                        }}
                        renderValue={(selected) => (
                            <HorizontalGroup
                                style={{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    gap: '10px',
                                    flexWrap: 'wrap'
                                }}
                            >
                                {selected.map((value) => {
                                    let person = people.find((p) => p._id === value);
                                    return person ? (
                                        <Chip
                                            label={person.name}
                                            color={person.name.toLowerCase()}
                                            key={value}
                                        />
                                    ) : null;
                                })}
                            </HorizontalGroup>
                        )}
                        sx={{ paddingY: '0px' }}
                    >
                        {people.map((person) => {
                            return (
                                <MenuItem
                                    key={person._id}
                                    value={person._id}
                                    sx={{ gap: '5px' }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: `${person.name.toLowerCase()}.main`,
                                            width: 20,
                                            height: 20
                                        }}
                                    >
                                        <Icon />
                                    </Avatar>
                                    {person.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <HorizontalGroup
                    style={{
                        width: '100%',
                        gap: '10px',
                        justifyContent: 'space-evenly',
                        marginTop: '10px'
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={close}
                        sx={{ width: '100%' }}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant="outlined"
                        color="primary"
                        size="large"
                        sx={{ width: '100%' }}
                        onClick={submit}
                        loading={saving}
                        disabled={name === '' || includedPeople.length === 0}
                    >
                        Save
                    </LoadingButton>
                </HorizontalGroup>
            </VerticalGroup>
        </Drawer>
    );
}
