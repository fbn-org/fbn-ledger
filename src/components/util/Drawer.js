import { Container, Divider, Drawer, Stack, Typography, useTheme } from '@mui/material';

export default function CustomDrawer({ open, title, subtitle, actions, children }) {
    const theme = useTheme();

    return (
        <Drawer
            anchor={'bottom'}
            open={open}
        >
            <Container
                maxWidth="sm"
                w="100%"
                sx={{
                    marginBottom: '30px'
                }}
            >
                <Divider style={{ width: '100%', marginBottom: '10px' }} />
                <Stack
                    direction="column"
                    width="100%"
                    maxWidth={theme.breakpoints.values.sm}
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Stack
                        direction="column"
                        width="100%"
                        alignItems="flex-start"
                        gap={2}
                        marginBottom="16px"
                    >
                        <Stack
                            direction="row"
                            width="100%"
                        >
                            <Stack
                                direction="column"
                                alignItems="flex-start"
                                spacing={0}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{ flexGrow: 1 }}
                                >
                                    {title}
                                </Typography>
                                {subtitle ? (
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                    >
                                        {subtitle}
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
                                {actions}
                            </Stack>
                        </Stack>

                        {children}
                    </Stack>
                </Stack>
            </Container>
        </Drawer>
    );
}
