import { useState } from 'react';

import { Collapse, ListItemButton, Stack, Typography } from '@mui/material';

import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function TransactionSection(props) {
    const [open, setOpen] = useState(props.open || false);

    return (
        <Stack
            direction="column"
            width="100%"
        >
            <ListItemButton
                sx={{ width: '100%', height: 'auto', paddingX: '5px' }}
                onClick={() => setOpen((a) => !a)}
            >
                <Stack
                    direction="row"
                    width="100%"
                    gap={1}
                >
                    {props.icon}
                    <Typography variant="h5">{props.title}</Typography>
                    <Stack
                        direction="row"
                        width="auto"
                        flexGrow={1}
                        justifyContent="flex-end"
                    >
                        {!open ? <ExpandMore color="secondary" /> : <ExpandLess color="secondary" />}
                    </Stack>
                </Stack>
            </ListItemButton>
            <Collapse
                in={open}
                style={{ width: '100%' }}
            >
                <Stack marginTop={1}>{props.children}</Stack>
            </Collapse>
        </Stack>
    );
}
