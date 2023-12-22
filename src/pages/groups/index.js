import { useState } from 'react';

import { Avatar, AvatarGroup, Button, Divider, Stack, Typography } from '@mui/material';

import { Create, Group, GroupAdd } from '@mui/icons-material';

import { useDisclosure } from 'react-use-disclosure';

import useLedger from '@/contexts/LedgerContext';

import PrimaryLayout from '@/layouts/PrimaryLayout';

import CreateGroup from '@/components/groups/CreateGroup';
import EditGroup from '@/components/groups/EditGroup';
import JoinGroup from '@/components/groups/JoinGroup';

export default function Groups({}) {
    const { user, groups, group: activeGroup } = useLedger();

    const { isOpen: isCreateOpen, open: onCreateOpen, close: onCreateClose } = useDisclosure();
    const { isOpen: isEditOpen, open: onEditOpen, close: onEditClose } = useDisclosure();
    const { isOpen: isJoinOpen, open: onJoinOpen, close: onJoinClose } = useDisclosure();

    const [editingGroup, setEditingGroup] = useState(null);

    return (
        <>
            <CreateGroup
                open={isCreateOpen}
                onClose={onCreateClose}
            />
            <EditGroup
                open={isEditOpen}
                group={editingGroup}
                onClose={onEditClose}
            />
            <JoinGroup
                open={isJoinOpen}
                onClose={onJoinClose}
            />

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
                    {groups &&
                        Object.keys(groups).map((groupId) => {
                            const group = groups[groupId].group;
                            const people = groups[groupId].people;

                            return (
                                <Stack
                                    key={group._id}
                                    as={Button}
                                    direction="row"
                                    alignItems="center"
                                    color="white"
                                    gap={1}
                                    justifyContent="flex-start"
                                    onClick={() => {
                                        setEditingGroup(groups[groupId]);
                                        onEditOpen();
                                    }}
                                >
                                    <AvatarGroup spacing="small">
                                        {people.map((person) => {
                                            return (
                                                <Avatar
                                                    key={person._id}
                                                    sx={{
                                                        width: '25px',
                                                        height: '25px'
                                                    }}
                                                    src={person.image}
                                                ></Avatar>
                                            );
                                        })}
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
                                            {group.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            lineHeight={1}
                                        >
                                            {people.length} members
                                        </Typography>
                                    </Stack>
                                </Stack>
                            );
                        })}
                </Stack>
            </Stack>
        </>
    );
}

Groups.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;
