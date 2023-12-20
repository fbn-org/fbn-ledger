import { useState } from 'react';

import {
    Avatar,
    Button,
    ClickAwayListener,
    Icon,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';

import { AutoAwesome, ContentCopy, Delete, Remove } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';

import Drawer from '@/components/util/Drawer';

import Spacer from '../util/Spacer';

function Section({ name, children }) {
    return (
        <Stack
            direction="column"
            width="100%"
            gap={1}
            mt={1}
        >
            <Typography variant="h5">{name}</Typography>
            {children}
        </Stack>
    );
}

export default function EditGroup({ open }) {
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    return (
        <Drawer
            title={'Edit group'}
            open={open}
            actions={
                <ClickAwayListener onClickAway={() => setConfirmationOpen(false)}>
                    <Tooltip
                        arrow
                        PopperProps={{
                            disablePortal: true
                        }}
                        onClose={() => setConfirmationOpen(false)}
                        open={confirmationOpen}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title="Tap again to delete this group"
                    >
                        <IconButton
                            color="secondary"
                            onClick={() => (confirmationOpen ? deleteTransaction() : setConfirmationOpen(true))}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </ClickAwayListener>
            }
        >
            <Stack
                direction="column"
                mt={1}
                gap={2}
                width="100%"
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Group name"
                    size="medium"
                    defaultValue="FBN"
                />

                <Section name="People">
                    <Stack
                        direction="column"
                        gap={1}
                    >
                        <Stack
                            direction="row"
                            gap={1}
                            alignItems="center"
                            px={1}
                        >
                            <Avatar sx={{ width: '20px', height: '20px' }}>
                                <Icon />
                            </Avatar>

                            <Stack
                                direction="row"
                                gap={0.5}
                                alignItems="center"
                            >
                                <Typography variant="h6">Colin</Typography>
                                <AutoAwesome
                                    fontSize="small"
                                    color="primary"
                                />
                            </Stack>

                            <Spacer />
                            <IconButton
                                size="small"
                                color="secondary"
                            >
                                <Remove />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Section>

                <Section name="Invite code">
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography
                            variant="body1"
                            fontFamily="monospace"
                        >
                            648e4ce5943894b71a1c60a3
                        </Typography>
                        <Spacer />
                        <IconButton
                            size="small"
                            color="primary"
                        >
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Stack>
                </Section>
            </Stack>

            <Stack
                direction="row"
                width="100%"
                gap={1}
                justifyContent="space-evenly"
                marginTop={1}
            >
                <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={null}
                    sx={{ width: '100%' }}
                >
                    Cancel
                </Button>
                <LoadingButton
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ width: '100%' }}
                    onClick={null}
                    loading={null}
                    // disabled={name === '' || includedPeople.length === 0}
                >
                    Save
                </LoadingButton>
            </Stack>
        </Drawer>
    );
}
