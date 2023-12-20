import { Button, Stack, TextField } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import Drawer from '../util/Drawer';

export default function JoinGroup({ open }) {
    return (
        <Drawer
            title="Join group"
            open={open}
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
                    label="Invite code"
                    size="medium"
                />
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
                    Join
                </LoadingButton>
            </Stack>
        </Drawer>
    );
}
