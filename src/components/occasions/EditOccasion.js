import { useEffect, useState } from 'react';

import {
    Avatar,
    Button,
    Chip,
    ClickAwayListener,
    FormControl,
    Icon,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    useTheme
} from '@mui/material';

import { Delete, KeyboardDoubleArrowRight } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import useLedger from '@/contexts/LedgerContext';

import useRequest from '@/hooks/useRequest';

import Drawer from '../util/Drawer';

dayjs.extend(utc);

export default function EditOccasion({ isNew, editData, group, people, open, onClose }) {
    const theme = useTheme();

    const request = useRequest();

    const { getPersonFromId } = useLedger();

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
            group: group._id,
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
                .then((data) => {
                    close();
                })
                .catch((err) => {});
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
                .then((data) => {
                    close();
                })
                .catch((err) => {});
        }
    }

    function deleteOccasion() {
        request(`/api/occasions/disconnectTransactions/${editData._id}`, {
            method: 'PUT'
        });

        request(`/api/occasions/${editData._id}`, {
            method: 'DELETE'
        }).then((data) => {
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
        onClose();
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
            open={open}
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
                            title="Tap again to delete this occasion"
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
            <Stack
                direction="column"
                width="100%"
                alignItems="flex-start"
                gap={2}
                mt={1}
            >
                <TextField
                    label="Name"
                    variant="outlined"
                    size="medium"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Stack
                    direction="row"
                    width="100%"
                    alignItems="center"
                    gap={1}
                    justifyContent="center"
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
                </Stack>

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
                            <Stack
                                direction="row"
                                gap={1}
                                justifyContent="flex-start"
                                flexWrap="wrap"
                            >
                                {selected.map((value) => {
                                    let person = getPersonFromId(value);
                                    return person ? (
                                        <Chip
                                            label={person.name}
                                            color={person._id.toLowerCase()}
                                            key={value}
                                        />
                                    ) : null;
                                })}
                            </Stack>
                        )}
                        sx={{ paddingY: '0px' }}
                    >
                        {people &&
                            people.map((person) => {
                                return (
                                    <MenuItem
                                        key={person._id}
                                        value={person._id}
                                        sx={{ gap: '5px' }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: `${person._id.toLowerCase()}.main`,
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

                <Stack
                    direction="row"
                    width="100%"
                    gap={1}
                    justifyContent="space-evenly"
                    marginTop={1}
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
                </Stack>
            </Stack>
        </Drawer>
    );
}
