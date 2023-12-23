import { useCallback, useState } from 'react';

import { IconButton, Stack, TextField } from '@mui/material';

import { ContentPaste } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';

import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

import useLedger from '@/contexts/LedgerContext';

import useRequest from '@/hooks/useRequest';

import Drawer from '../util/Drawer';

export default function JoinGroup({ open, onClose }) {
    const { update } = useSession();
    const { user, refresh } = useLedger();

    const request = useRequest();

    const [groupId, setGroupId] = useState('');
    const [saving, setSaving] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const close = useCallback(() => {
        setGroupId('');
        onClose();
    }, [onClose]);

    const submit = useCallback(() => {
        setSaving(true);

        if (user.groups.includes(groupId)) {
            enqueueSnackbar('already in that group', {
                variant: 'warning'
            });
            setSaving(false);
            return;
        }

        request(`/api/groups/join/${groupId}`, {
            method: 'POST'
        })
            .then((data) => {
                setSaving(false);
                refresh();
                update();
                close();
            })
            .catch((err) => {
                enqueueSnackbar('unable to join group', {
                    variant: 'error'
                });
                setSaving(false);
            });
    }, [groupId, close, user, refresh, request, enqueueSnackbar, update]);

    return (
        <Drawer
            title="Join group"
            open={open}
            onClose={close}
        >
            <Stack
                direction="row"
                mt={1}
                spacing={1}
                width="100%"
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Invite code"
                    size="medium"
                    value={groupId}
                    onChange={(e) => {
                        setGroupId(e.target.value);
                    }}
                />
                <IconButton
                    size="small"
                    sx={{
                        px: 2
                    }}
                    color="primary"
                    onClick={async () => {
                        const groupId = await navigator.clipboard.readText();
                        setGroupId(groupId);
                    }}
                >
                    <ContentPaste fontSize="small" />
                </IconButton>
            </Stack>

            <Stack
                direction="row"
                width="100%"
                gap={1}
                justifyContent="space-evenly"
                marginTop={1}
            >
                <LoadingButton
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ width: '100%' }}
                    onClick={submit}
                    loading={saving}
                    disabled={groupId.length === 0}
                >
                    Join
                </LoadingButton>
            </Stack>
        </Drawer>
    );
}
