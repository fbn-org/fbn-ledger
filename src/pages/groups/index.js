import { Avatar, AvatarGroup, Button, Divider, Icon, Stack, Typography } from '@mui/material';

import { Create, Group, GroupAdd } from '@mui/icons-material';

import PrimaryLayout from '@/layouts/PrimaryLayout';

import NewGroupDialog from '@/components/groups/CreateGroup';
import GroupEditDialog from '@/components/groups/EditGroup';

export default function Groups({}) {
    return (
        <>
            <NewGroupDialog open={false} />
            <GroupEditDialog open={false} />

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

            <Stack
                direction="column"
                gap={2}
                mt={2}
            >
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="space-evenly"
                    alignItems="center"
                >
                    <Button
                        startIcon={<GroupAdd />}
                        variant="outlined"
                        width="100%"
                        flexGrow={1}
                        size="medium"
                    >
                        Join group
                    </Button>
                    <Button
                        startIcon={<Create />}
                        variant="outlined"
                        width="100%"
                        flexGrow={1}
                        size="medium"
                    >
                        Create group
                    </Button>
                </Stack>

                <Divider />

                <Stack
                    direction="column"
                    height="100%"
                    width="100%"
                >
                    <Stack
                        as={Button}
                        direction="row"
                        alignItems="center"
                        color="white"
                        gap={1}
                        justifyContent="flex-start"
                    >
                        <AvatarGroup spacing="small">
                            <Avatar
                                sx={{
                                    width: '25px',
                                    height: '25px'
                                }}
                            >
                                <Icon />
                            </Avatar>
                            <Avatar
                                sx={{
                                    width: '25px',
                                    height: '25px'
                                }}
                            >
                                <Icon />
                            </Avatar>
                            <Avatar
                                sx={{
                                    width: '25px',
                                    height: '25px'
                                }}
                            >
                                <Icon />
                            </Avatar>
                            <Avatar
                                sx={{
                                    width: '25px',
                                    height: '25px'
                                }}
                            >
                                <Icon />
                            </Avatar>
                        </AvatarGroup>

                        <Stack
                            direction="column"
                            gap={0.5}
                            alignItems="flex-start"
                        >
                            <Typography
                                variant="h6"
                                color="white"
                                lineHeight={1}
                            >
                                FBN
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                lineHeight={1}
                            >
                                4 members
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
}

Groups.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;
