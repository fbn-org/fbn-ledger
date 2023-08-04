import { useState } from 'react';

import { Collapse, IconButton, ListItemButton, Typography } from '@mui/material';

import { ExpandLess, ExpandMore } from '@mui/icons-material';

import HorizontalGroup from '../util/HorizontalGroup';
import VerticalGroup from '../util/VerticalGroup';

export default function TransactionSection(props) {
    const [open, setOpen] = useState(props.open || false);

    return (
        <VerticalGroup style={{ width: '100%' }}>
            <ListItemButton
                sx={{ width: '100%', height: 'auto', paddingX: '5px' }}
                onClick={() => setOpen((a) => !a)}
            >
                <HorizontalGroup style={{ width: '100%', gap: '10px' }}>
                    {props.icon}
                    <Typography variant="h5">{props.title}</Typography>
                    <HorizontalGroup style={{ width: 'auto', flexGrow: 1, justifyContent: 'flex-end' }}>
                        {!open ? <ExpandMore color="secondary" /> : <ExpandLess color="secondary" />}
                    </HorizontalGroup>
                </HorizontalGroup>
            </ListItemButton>
            <Collapse
                in={open}
                style={{ width: '100%' }}
            >
                <VerticalGroup style={{ marginTop: '10px' }}>{props.children}</VerticalGroup>
            </Collapse>
        </VerticalGroup>
    );
}
