import { useEffect, useState } from 'react';

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

import { AutoAwesome, ContentCopy, DeleteForever, Remove } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';

import { useSnackbar } from 'notistack';

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

export default function EditGroup({ open, group, onClose }) {
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const [groupData, setGroupData] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const [groupPeople, setGroupPeople] = useState(null);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (group) {
            setGroupData(group.group);
            setGroupName(group.group.name);
            setGroupPeople(group.people);
        }
    }, [group]);

    return (
        <Drawer
            title={'Edit group'}
            open={open}
            actions={
                <ClickAwayListener onClickAway={() => {}}>
                    <Tooltip
                        arrow
                        PopperProps={{
                            disablePortal: true
                        }}
                        onClose={null}
                        open={null}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title="Tap again to delete this group"
                    >
                        <IconButton
                            color="secondary"
                            onClick={null}
                        >
                            <DeleteForever />
                        </IconButton>
                    </Tooltip>
                </ClickAwayListener>
            }
        >
            {groupData && (
                <>
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
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />

                        <Section name="People">
                            <Stack
                                direction="column"
                                gap={1}
                            >
                                {groupData.people.map((personId) => {
                                    const person = groupPeople.find((person) => person._id === personId);

                                    return (
                                        <Stack
                                            key={person._id}
                                            direction="row"
                                            gap={1.5}
                                            alignItems="center"
                                            px={1}
                                        >
                                            <Avatar
                                                src={person.image}
                                                sx={{ width: '25px', height: '25px' }}
                                            >
                                                <Icon />
                                            </Avatar>

                                            <Stack
                                                direction="row"
                                                gap={0.5}
                                                alignItems="center"
                                            >
                                                <Typography variant="h6">{person.name}</Typography>
                                                {person._id === groupData.createdBy && (
                                                    <AutoAwesome
                                                        fontSize="small"
                                                        color="secondary"
                                                    />
                                                )}
                                            </Stack>

                                            <Spacer />
                                            <IconButton
                                                size="small"
                                                color="secondary"
                                            >
                                                <Remove />
                                            </IconButton>
                                        </Stack>
                                    );
                                })}
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
                                    {group.group._id}
                                </Typography>
                                <Spacer />
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(group.group._id);
                                        enqueueSnackbar('copied invite code', {
                                            variant: 'success'
                                        });
                                    }}
                                >
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Section>
                    </Stack>
                </>
            )}

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
                    onClick={onClose}
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
