import { useEffect } from 'react';

import { Chip, InputAdornment, TextField } from '@mui/material';

import { Add, KeyboardDoubleArrowRight } from '@mui/icons-material';

import HorizontalGroup from '../util/HorizontalGroup';
import VerticalGroup from '../util/VerticalGroup';

export default function PersonItem(props) {
    const personId = props.personId;
    const name = props.name;
    const individualAmounts = props.individualAmounts;
    const setIndividualAmounts = props.setIndividualAmounts;

    // useEffect(() => {
    //     if (individualAmounts[personId] === undefined) {
    //         setIndividualAmounts(individualAmounts => ({ ...individualAmounts, [personId]: [""] }))
    //     }
    // }, [])

    useEffect(() => {
        if (individualAmounts[personId] !== undefined) {
            if (individualAmounts[personId].every((amount) => amount !== '')) {
                setIndividualAmounts((individualAmounts) => ({
                    ...individualAmounts,
                    [personId]: [...individualAmounts[personId], '']
                }));
            }

            if (individualAmounts[personId].some((amount) => amount === '')) {
                const emptyIndex = individualAmounts[personId].findIndex((amount) => amount === '');
                if (emptyIndex !== individualAmounts[personId].length - 1) {
                    setIndividualAmounts((individualAmounts) => ({
                        ...individualAmounts,
                        [personId]: [
                            ...individualAmounts[personId].slice(0, emptyIndex),
                            ...individualAmounts[personId].slice(emptyIndex + 1)
                        ]
                    }));
                }
            }
        }
    }, [individualAmounts, personId, setIndividualAmounts]);

    return (
        <>
            {individualAmounts[personId] !== undefined ? (
                <VerticalGroup
                    key={personId}
                    style={{ width: ' 100%', gap: '10px' }}
                >
                    <HorizontalGroup style={{ width: '100%', gap: '5px' }}>
                        <Chip
                            label={name}
                            color={name.toLowerCase()}
                            variant="outlined"
                            sx={{ flexBasis: '40%' }}
                        />
                        <KeyboardDoubleArrowRight />
                        <TextField
                            variant="outlined"
                            size="small"
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                            sx={{ flexBasis: '60%' }}
                            value={individualAmounts[personId][0]}
                            onChange={(e) => {
                                setIndividualAmounts((individualAmounts) => ({
                                    ...individualAmounts,
                                    [personId]: [e.target.value, ...individualAmounts[personId].slice(1)]
                                }));
                            }}
                        />
                    </HorizontalGroup>

                    {individualAmounts[personId].slice(1).map((amount, index) => {
                        const id = index + 1;
                        return (
                            <HorizontalGroup
                                key={id}
                                style={{ width: '100%', gap: '5px' }}
                            >
                                <div style={{ flexBasis: '40%' }}>
                                    {/* {id === 1 ?
                                <>
                                    <Typography variant="subtitle2" color={`${name.toLowerCase()}.main`} sx={{ textAlign: "center" }} >${total}</Typography>
                                </>
                                : null} */}
                                </div>
                                <Add />
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                                    }}
                                    sx={{ flexBasis: '60%' }}
                                    value={individualAmounts[personId][id]}
                                    onChange={(e) => {
                                        console.log(individualAmounts[personId].slice(0, id));
                                        setIndividualAmounts((individualAmounts) => ({
                                            ...individualAmounts,
                                            [personId]: [
                                                ...individualAmounts[personId].slice(0, id),
                                                e.target.value,
                                                ...individualAmounts[personId].slice(id + 1)
                                            ]
                                        }));
                                    }}
                                />
                            </HorizontalGroup>
                        );
                    })}
                </VerticalGroup>
            ) : null}
        </>
    );
}
