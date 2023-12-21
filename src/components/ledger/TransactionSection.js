import { useState } from 'react';

import { Collapse, ListItemButton, Stack, Typography, useTheme } from '@mui/material';

import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function TransactionSection({ open, icon, title, children }) {
    const [realOpen, setRealOpen] = useState(open || false);
    const theme = useTheme();

    return (
        <Stack
            direction="column"
            width="100%"
        >
            <ListItemButton
                sx={{ width: '100%', height: 'auto', paddingX: '5px', borderRadius: '5px' }}
                onClick={() => setRealOpen((a) => !a)}
            >
                <Stack
                    direction="row"
                    width="100%"
                    gap={1}
                    alignItems="center"
                >
                    {icon}
                    <Typography variant="h5">{title}</Typography>
                    <Stack
                        direction="row"
                        width="auto"
                        flexGrow={1}
                        justifyContent="flex-end"
                    >
                        {!realOpen ? <ExpandMore color="secondary" /> : <ExpandLess color="secondary" />}
                    </Stack>
                </Stack>
            </ListItemButton>
            <Collapse
                in={realOpen}
                style={{ width: '100%' }}
            >
                <Stack marginTop={1}>{children}</Stack>
            </Collapse>
        </Stack>
    );
}
