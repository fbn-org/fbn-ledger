import { Paper, Stack, Typography } from '@mui/material';

function Card({ title, subtitle, icon, subtitleIcon, titleChip, actions, footer, children, style, ...props }) {
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
                ...style
            }}
        >
            {title || icon || actions ? (
                <Stack
                    direction="row"
                    mb={children ? '10px' : 0}
                    width="100%"
                    alignItems="flex-start"
                >
                    {title || icon ? (
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
                                    {icon}
                                    <Typography variant="h5">{title}</Typography>
                                    {titleChip}
                                </Stack>
                                <Stack gap={1}>
                                    {subtitleIcon}
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                    >
                                        {subtitle}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    ) : null}
                    {actions ? (
                        <Stack
                            direction="row"
                            gap={1}
                            flexGrow={1}
                            justifyContent="flex-end"
                            alignItems="flex-start"
                        >
                            {actions}
                        </Stack>
                    ) : null}
                </Stack>
            ) : null}

            {children}

            {footer ? (
                <Stack
                    direction="row"
                    width="100%"
                    mt={1}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {footer}
                    </Typography>
                </Stack>
            ) : null}
        </Paper>
    );
}

export default Card;
