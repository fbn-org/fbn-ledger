import { Stack, Typography } from '@mui/material';

import { Group } from '@mui/icons-material';

import PrimaryLayout from '@/layouts/PrimaryLayout';

export default function Groups({}) {
    return (
        <>
            <Stack
                direction="row"
                gap={1}
                alignItems="center"
            >
                <Group fontSize="large" />
                <Typography
                    variant="h4"
                    color="white"
                >
                    Groups
                </Typography>
            </Stack>
        </>
    );
}

Groups.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;
