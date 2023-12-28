import { useCallback, useEffect, useState } from 'react';

import {
    Avatar,
    Button,
    ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Icon,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';

import { AutoAwesome, ContentCopy, DeleteForever, Remove } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';

import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useDisclosure } from 'react-use-disclosure';

import useLedger from '@/contexts/LedgerContext';

import useRequest from '@/hooks/useRequest';

import Drawer from '@/components/util/Drawer';

import Spacer from '../util/Spacer';

function PersonListItem({ person, groupData, onDelete }) {
    const { isOpen: isConfirmOpen, open: onConfirmOpen, close: onConfirmClose } = useDisclosure();

    const deletePerson = useCallback(() => {
        onDelete();
        onConfirmClose();
    }, [onDelete, onConfirmClose]);

    return (
        <ClickAwayListener onClickAway={onConfirmClose}>
            <Tooltip
                arrow
                PopperProps={{
                    disablePortal: true
                }}
                onClose={onConfirmClose}
                open={isConfirmOpen}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="Tap again to remove from group"
            >
                <IconButton
                    size="small"
                    color="secondary"
                    disabled={person._id === groupData.createdBy}
                    onClick={() => (isConfirmOpen ? deletePerson() : onConfirmOpen())}
                >
                    <Remove />
                </IconButton>
            </Tooltip>
        </ClickAwayListener>
    );
}

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
    const { isOpen: isConfirmOpen, open: onConfirmOpen, close: onConfirmClose } = useDisclosure();
    const { isOpen: isInitialDeleteOpen, open: onInitialDeleteOpen, close: onInitialDeleteClose } = useDisclosure();

    const [groupData, setGroupData] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const [groupPeople, setGroupPeople] = useState(null);

    const [saving, setSaving] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const request = useRequest();

    const { user, refresh } = useLedger();

    const { update } = useSession();

    useEffect(() => {
        if (group) {
            setGroupData(group.group);
            setGroupName(group.group.name);
            setGroupPeople(group.people);
        }
    }, [group]);

    const close = useCallback(() => {
        setGroupData(null);
        setGroupName(null);
        setGroupPeople(null);
        setSaving(false);
        onConfirmClose();
        onClose();
    }, [onClose, onConfirmClose]);

    const deleteGroup = useCallback(() => {
        request(`/api/groups/${groupData._id}`, {
            method: 'DELETE'
        })
            .then((data) => {
                enqueueSnackbar('group deleted', {
                    variant: 'success'
                });
                update();
                close();
            })
            .catch((err) => {
                enqueueSnackbar('unable to delete group', {
                    variant: 'error'
                });
            });
    }, [enqueueSnackbar, groupData, request, close, update]);

    const removePerson = useCallback(
        (personId) => {
            const personName = groupPeople.find((person) => person._id === personId).name;
            request(`/api/groups/${groupData._id}/leave/${personId}`, {
                method: 'DELETE'
            })
                .then((data) => {
                    setGroupPeople((people) => {
                        return people.filter((person) => person._id !== personId);
                    });
                    enqueueSnackbar(`${personName} removed`, {
                        variant: 'success'
                    });
                    update();
                    refresh();
                    if (user.id === personId) {
                        close();
                    }
                })
                .catch((err) => {
                    enqueueSnackbar('unable to remove person', {
                        variant: 'error'
                    });
                });
        },
        [request, groupData, enqueueSnackbar, update, refresh, user, groupPeople, close]
    );

    const saveGroup = useCallback(() => {
        setSaving(true);
        request(`/api/groups/${groupData._id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...groupData,
                name: groupName
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((data) => {
                update();
                refresh();
                close();
            })
            .catch((err) => {
                enqueueSnackbar('unable to update group', {
                    variant: 'error'
                });
            });
    }, [enqueueSnackbar, groupData, groupName, refresh, request, update, close]);

    return (
        <>
            <Dialog
                maxWidth="sm"
                open={isConfirmOpen}
                onClose={onConfirmClose}
            >
                <DialogTitle>Delete group</DialogTitle>
                <DialogContent>
                    <DialogContentText>This will delete all associated occasions and transactions.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onConfirmClose}>Cancel</Button>
                    <Button onClick={deleteGroup}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Drawer
                title={'Edit group'}
                open={open}
                actions={
                    user?.id === groupData?.createdBy ? (
                        <ClickAwayListener onClickAway={onInitialDeleteClose}>
                            <Tooltip
                                arrow
                                PopperProps={{
                                    disablePortal: true
                                }}
                                onClose={onInitialDeleteClose}
                                open={isInitialDeleteOpen}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title="Tap again to delete this group"
                            >
                                <IconButton
                                    color="secondary"
                                    onClick={() => (isInitialDeleteOpen ? onConfirmOpen() : onInitialDeleteOpen())}
                                >
                                    <DeleteForever />
                                </IconButton>
                            </Tooltip>
                        </ClickAwayListener>
                    ) : null
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
                                disabled={user.id !== groupData.createdBy}
                            />

                            <Section name="People">
                                <Stack
                                    direction="column"
                                    gap={1}
                                >
                                    {groupPeople.map((person) => {
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
                                                {user.id === groupData.createdBy || user.id === person._id ? (
                                                    <PersonListItem
                                                        person={person}
                                                        groupData={groupData}
                                                        onDelete={() => {
                                                            removePerson(person._id);
                                                        }}
                                                    />
                                                ) : null}
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
                        onClick={saveGroup}
                        loading={saving}
                        // disabled={}
                    >
                        Done
                    </LoadingButton>
                </Stack>
            </Drawer>
        </>
    );
}
