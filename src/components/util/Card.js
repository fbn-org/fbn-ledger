import { Paper, Stack, Typography } from '@mui/material';

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
                <Stack
                    direction="row"
                    mb={props.children ? '10px' : 0}
                    width="100%"
                    alignItems="flex-start"
                >
                    {props.title || props.icon ? (
                        <Stack
                            direction="row"
                            gap={1}
                        >
                            <Stack
                                direction="column"
                                alignItems="flex-start"
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                >
                                    {props.icon}
                                    <Typography variant="h5">{props.title}</Typography>
                                    {props.titleChip}
                                </Stack>
                                <Stack gap={1}>
                                    {props.subtitleIcon}
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                    >
                                        {props.subtitle}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    ) : null}
                    {props.actions ? (
                        <Stack
                            direction="row"
                            gap={1}
                            flexGrow={1}
                            justifyContent="flex-end"
                            alignItems="flex-start"
                        >
                            {props.actions}
                        </Stack>
                    ) : null}
                </Stack>
            ) : null}

            {props.children}

            {props.footer ? (
                <Stack
                    direction="row"
                    width="100%"
                    mt={1}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {props.footer}
                    </Typography>
                </Stack>
            ) : null}
        </Paper>
    );
}

export default Card;
