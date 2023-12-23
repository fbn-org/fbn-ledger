import { useCallback, useState } from 'react';

import { Stack, TextField } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { useSession } from 'next-auth/react';

import useLedger from '@/contexts/LedgerContext';

import useRequest from '@/hooks/useRequest';

import Drawer from '@/components/util/Drawer';

export default function CreateGroup({ open, onClose }) {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);

    const { user, refresh } = useLedger();
    const { update } = useSession();

    const request = useRequest();

    const close = useCallback(() => {
        setName('');
        onClose();
        setSaving(false);
    }, [onClose]);

    const submit = useCallback(() => {
        setSaving(true);

        const payload = {
            name: name,
            people: [user.id],
            createdBy: user.id
        };

        console.log(payload);

        request('/api/groups/create', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((data) => {
                console.log(data);
                refresh();
                update();
                close();
            })
            .catch((err) => {});
    }, [name, user, close, refresh, request, update]);

    return (
        <Drawer
            title={'Create group'}
            open={open}
            actions={null}
            onClose={close}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="a creative name"
                >
                    Group name
                </TextField>

                {/* <Select>
                    <MenuItem>
                        <Avatar sx={{ bgcolor: 'red', width: '20px', height: '20px' }}>
                            <Icon />
                        </Avatar>
                    </MenuItem>
                </Select> */}
            </Stack>

            <Stack
                direction="row"
                width="100%"
                gap={1}
                justifyContent="space-evenly"
                marginTop={1}
            >
                {/* <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={close}
                    sx={{ width: '100%' }}
                >
                    Cancel
                </Button> */}
                <LoadingButton
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ width: '100%' }}
                    onClick={submit}
                    loading={saving}
                    disabled={name === ''}
                >
                    Create
                </LoadingButton>
            </Stack>
        </Drawer>
    );
}
