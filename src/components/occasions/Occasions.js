import { useState } from 'react'

import { Typography, Grid, Chip, IconButton, Button, Fab, AvatarGroup, Avatar, Icon } from '@mui/material'
import { Add, Celebration, Edit } from '@mui/icons-material'

import Card from '../Card.js'
import HorizontalGroup from '../HorizontalGroup.js'
import VerticalGroup from '../VerticalGroup.js'
import EditOccasion from './EditOccasion.js'

export default function Occasions(props) {

    const [editorOpen, setEditorOpen] = useState(false)

    return (
        <>
            <EditOccasion open={editorOpen} />
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", border: "none" }}>

                <Fab color="secondary" sx={{ position: "fixed", bottom: 96, right: 16, zIndex: 2 }} onClick={() => { setEditorOpen(true) }}>
                    <Add />
                </Fab>

                <HorizontalGroup style={{ gap: "10px" }}>
                    <Celebration fontSize="large" />
                    <Typography variant="h4">Occasions</Typography>
                </HorizontalGroup>

                <VerticalGroup style={{ width: "100%", gap: "15px", }}>
                    <Card
                        icon={<AvatarGroup spacing="small">
                            <Avatar sx={{ bgcolor: "colin.main", height: 20, width: 20 }}><Icon/></Avatar>
                            <Avatar sx={{ bgcolor: "eric.main", height: 20, width: 20 }}><Icon/></Avatar>
                            <Avatar sx={{ bgcolor: "hudson.main", height: 20, width: 20 }}><Icon/></Avatar>
                            <Avatar sx={{ bgcolor: "matty.main", height: 20, width: 20 }}><Icon/></Avatar>
                        </AvatarGroup>}
                        title="longer name for testing"
                        subtitle="2023-06-10 - 2023-06-12"
                        //titleChip={<Chip label="Active" color="primary" variant="outlined" size="small" />}
                        actions={<IconButton color="primary"><Edit /></IconButton>} style={{ width: "100%" }}
                    >
                        <Grid container spacing={2}>

                            <Grid item xs={6}>
                                <VerticalGroup style={{ alignItems: "flex-start" }}>
                                    <Typography variant="h6">
                                        15
                                    </Typography>
                                    <Typography variant="body2">
                                        transactions
                                    </Typography>
                                </VerticalGroup>
                            </Grid>

                            <Grid item xs={6}>
                                <VerticalGroup style={{ alignItems: "flex-start" }}>
                                    <Typography variant="h6">
                                        $1000
                                    </Typography>
                                    <Typography variant="body2">
                                        total spend
                                    </Typography>
                                </VerticalGroup>
                            </Grid>

                        </Grid>
                    </Card>



                    <Card
                        title="philly trip"
                        subtitle="2023-06-10 - 2023-06-12"
                        titleChip={<Chip label="Complete" color="secondary" variant="outlined" size="small" />}
                        actions={<IconButton color="primary"><Edit /></IconButton>}
                        style={{ width: "100%" }}
                    >
                        <VerticalGroup style={{ width: "100%", gap: "15px", }}>
                            <Grid container spacing={2}>

                                <Grid item xs={6}>
                                    <VerticalGroup style={{ alignItems: "flex-start" }}>
                                        <Typography variant="h6">
                                            15
                                        </Typography>
                                        <Typography variant="body2">
                                            transactions
                                        </Typography>
                                    </VerticalGroup>
                                </Grid>

                                <Grid item xs={6}>
                                    <VerticalGroup style={{ alignItems: "flex-start" }}>
                                        <Typography variant="h6">
                                            $1000
                                        </Typography>
                                        <Typography variant="body2">
                                            total spend
                                        </Typography>
                                    </VerticalGroup>
                                </Grid>

                            </Grid>

                            <Button variant="outlined" color="primary" sx={{ borderRadius: "5px", width: "100%", height: "auto", }}>Payouts</Button>
                        </VerticalGroup>
                    </Card>
                </VerticalGroup>

            </div>
        </>
    )
}