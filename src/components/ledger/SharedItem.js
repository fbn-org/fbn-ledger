import {
    Avatar,
    AvatarGroup,
    FormControl,
    Icon,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';

import { KeyboardDoubleArrowRight } from '@mui/icons-material';

import HorizontalGroup from '../util/HorizontalGroup';
import VerticalGroup from '../util/VerticalGroup';

export default function SharedItem(props) {
    const people = props.people;
    const sharedAmounts = props.sharedAmounts;
    const setSharedAmounts = props.setSharedAmounts;
    const sharedItem = props.sharedItem;
    const index = props.index;

    function updatePeople(event) {
        const {
            target: { value }
        } = event;
        let selectedPeople = typeof value === 'string' ? value.split(',') : value;
        setSharedAmounts((old) => {
            let o = [...old];
            o[index] = {
                people: selectedPeople,
                amount: sharedAmounts[index].amount
            };
            return o;
        });
    }

    function updateAmount(e) {
        setSharedAmounts((old) => {
            let o = [...old];
            o[index] = {
                people: sharedAmounts[index].people,
                amount: e.target.value
            };
            return o;
        });
    }

    return (
        <HorizontalGroup style={{ width: '100%', gap: '5px' }}>
            <FormControl
                size="small"
                sx={{ flexBasis: '40%' }}
            >
                <InputLabel id="demo-multiple-name-label">People</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    label="People"
                    multiple
                    value={sharedAmounts[index].people}
                    onChange={updatePeople}
                    renderValue={(selected) => (
                        <HorizontalGroup style={{ justifyContent: 'flex-start', width: '100%' }}>
                            <AvatarGroup spacing="small">
                                {selected.map((value) => {
                                    let person = people.find((p) => p.id === value);
                                    return person ? (
                                        <Avatar
                                            sx={{
                                                bgcolor: `${person.name.toLowerCase()}.main`,
                                                width: 18,
                                                height: 18
                                            }}
                                            key={value}
                                        >
                                            <Icon />
                                        </Avatar>
                                    ) : null;
                                })}
                            </AvatarGroup>
                        </HorizontalGroup>
                    )}
                >
                    {people.map((person) => {
                        return (
                            <MenuItem
                                key={person.id}
                                value={person.id}
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
            <KeyboardDoubleArrowRight />
            <TextField
                variant="outlined"
                size="small"
                type="number"
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                sx={{ flexBasis: '60%' }}
                value={sharedAmounts[index].amount}
                onChange={updateAmount}
            />
        </HorizontalGroup>
    );
}