import { Paper, Typography } from '@mui/material';

import HorizontalGroup from './HorizontalGroup.js';
import VerticalGroup from './VerticalGroup.js';

function Card(props) {
    return (
        <Paper
            variant="outlined"
            sx={{
                height: 'auto',
                width: '100%',
                padding: '15px',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                ...props.style
            }}
        >
            {props.title || props.icon || props.actions ? (
                <HorizontalGroup
                    style={{
                        marginBottom: props.children ? '10px' : 0,
                        width: '100%',
                        alignItems: 'flex-start'
                    }}
                >
                    {props.title || props.icon ? (
                        <HorizontalGroup style={{ gap: '10px' }}>
                            <VerticalGroup style={{ alignItems: 'flex-start' }}>
                                <HorizontalGroup style={{ gap: '10px' }}>
                                    {props.icon}
                                    <Typography variant="h5">{props.title}</Typography>
                                    {props.titleChip}
                                </HorizontalGroup>
                                <HorizontalGroup style={{ gap: '5px' }}>
                                    {props.subtitleIcon}
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                    >
                                        {props.subtitle}
                                    </Typography>
                                </HorizontalGroup>
                            </VerticalGroup>
                        </HorizontalGroup>
                    ) : null}
                    {props.actions ? (
                        <HorizontalGroup
                            style={{
                                gap: '5px',
                                flexGrow: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start'
                            }}
                        >
                            {props.actions}
                        </HorizontalGroup>
                    ) : null}
                </HorizontalGroup>
            ) : null}

            {props.children}

            {props.footer ? (
                <HorizontalGroup style={{ width: '100%', marginTop: '5px' }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {props.footer}
                    </Typography>
                </HorizontalGroup>
            ) : null}
        </Paper>
    );
}

export default Card;
