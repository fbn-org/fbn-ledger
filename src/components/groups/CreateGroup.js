import { Button, Stack, TextField } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import Drawer from '@/components/util/Drawer';

export default function CreateGroup({ open }) {
    return (
        <Drawer
            title={'New Group'}
            open={open}
            actions={null}
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
                    Create
                </LoadingButton>
            </Stack>
        </Drawer>
    );
}
