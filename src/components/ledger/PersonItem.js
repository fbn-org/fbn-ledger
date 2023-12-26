import { useEffect } from 'react';

import { Chip, InputAdornment, Stack, TextField } from '@mui/material';

import { Add, KeyboardDoubleArrowRight } from '@mui/icons-material';

import useLedger from '@/contexts/LedgerContext';

export default function PersonItem({ personId, name, individualAmounts, setIndividualAmounts }) {
    // useEffect(() => {
    //     if (individualAmounts[personId] === undefined) {
    //         setIndividualAmounts(individualAmounts => ({ ...individualAmounts, [personId]: [""] }))
    //     }
    // }, [])

    const { checkMembership } = useLedger();

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
            {individualAmounts[personId] && (
                <Stack
                    direction="column"
                    width="100%"
                    gap={1}
                    key={personId}
                >
                    <Stack
                        direction="row"
                        width="100%"
                        gap={1}
                        alignItems="center"
                    >
                        <Chip
                            label={name}
                            color={checkMembership(personId) ? personId : 'default'}
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
                    </Stack>

                    {individualAmounts[personId].slice(1).map((amount, index) => {
                        const id = index + 1;
                        return (
                            <Stack
                                direction="row"
                                width="100%"
                                gap={1}
                                key={id}
                                alignItems="center"
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
                            </Stack>
                        );
                    })}
                </Stack>
            )}
        </>
    );
}
