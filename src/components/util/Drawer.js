import { Container, Divider, Slide, Stack, Typography, useTheme } from '@mui/material';

export default function Drawer(props) {
    const theme = useTheme();

    return (
        <Container maxWidth="sm">
            <Slide
                direction="up"
                in={props.open}
                mountOnEnter
                unmountOnExit
                style={{ position: 'relative' }}
            >
                <div
                    style={{
                        position: 'fixed',
                        width: '100vw',
                        maxHeight: '100vh',
                        left: 0,
                        overflowY: 'scroll',
                        bottom: 0,
                        background: theme.palette.background.default,
                        zIndex: 100,
                        padding: '0px 15px 80px 15px',
                        paddingBottom: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}
                >
                    <Stack
                        direction="column"
                        width="100%"
                        maxWidth={theme.breakpoints.values.sm}
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <Divider style={{ width: '100%', marginBottom: '15px' }} />

                        <Stack
                            direction="column"
                            width="100%"
                            alignItems="flex-start"
                            gap={1}
                            marginBottom="16px"
                        >
                            <Stack
                                direction="row"
                                width="100%"
                            >
                                <Stack
                                    direction="column"
                                    alignItems="flex-start"
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{ flexGrow: 1 }}
                                    >
                                        {props.title}
                                    </Typography>
                                    {props.subtitle ? (
                                        <Typography
                                            variant="subtitle1"
                                            color="text.secondary"
                                        >
                                            {props.subtitle}
                                        </Typography>
                                    ) : null}
                                </Stack>
                                <Stack
                                    direction="row"
                                    height="100%"
                                    gap={1}
                                    flexGrow={1}
                                    justifyContent="flex-end"
                                    alignItems="flex-start"
                                    alignSelf="flex-start"
                                >
                                    {props.actions}
                                </Stack>
                            </Stack>

                            {props.children}
                        </Stack>
                    </Stack>
                </div>
            </Slide>
        </Container>
    );
}
