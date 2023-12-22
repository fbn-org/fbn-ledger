import {
    Avatar,
    AvatarGroup,
    Container,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';

import { ExitToApp, Group } from '@mui/icons-material';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

import useLedger from '@/contexts/LedgerContext';

export default function MenuDrawer({ open, onClose }) {
    const { user, groups, group: selectedGroup, setActiveGroup } = useLedger();

    return (
        <Drawer
            anchor={'bottom'}
            open={open}
            onClose={() => {
                onClose();
            }}
        >
            <Container
                maxWidth="sm"
                sx={{ pt: '16px', mb: '24px' }}
            >
                <Stack
                    direction="column"
                    spacing={2}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Avatar
                            src={user?.image}
                            sx={{
                                width: '35px',
                                height: '35px'
                            }}
                        />
                        <Typography variant="h5">{user?.name}</Typography>
                    </Stack>

                    <Stack
                        direction="column"
                        spacing={1}
                    >
                        <List
                            sx={{ width: '100%' }}
                            disablePadding
                            dense
                        >
                            {groups &&
                                Object.keys(groups).map((groupId) => {
                                    const group = groups[groupId].group;
                                    const people = groups[groupId].people;
                                    return (
                                        <ListItem
                                            disablePadding
                                            key={groupId}
                                        >
                                            <ListItemButton
                                                selected={selectedGroup._id === group._id}
                                                onClick={setActiveGroup(group._id)}
                                            >
                                                <ListItemIcon>
                                                    <AvatarGroup
                                                        max={4}
                                                        spacing="small"
                                                    >
                                                        {people.map((person) => (
                                                            <Avatar
                                                                key={person._id}
                                                                src={person?.image}
                                                                sx={{
                                                                    width: 20,
                                                                    height: 20
                                                                }}
                                                            />
                                                        ))}
                                                    </AvatarGroup>
                                                </ListItemIcon>
                                                <ListItemText>FBN</ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                        </List>
                        <Divider />
                        <List
                            sx={{ width: '100%' }}
                            disablePadding
                            dense
                        >
                            <ListItem disablePadding>
                                <ListItemButton
                                    LinkComponent={Link}
                                    href="/groups"
                                >
                                    <ListItemIcon>
                                        <Group />
                                    </ListItemIcon>
                                    <ListItemText>Groups</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={signOut}>
                                    <ListItemIcon>
                                        <ExitToApp />
                                    </ListItemIcon>
                                    <ListItemText>Sign out</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Stack>
                </Stack>
            </Container>
        </Drawer>
    );
}
