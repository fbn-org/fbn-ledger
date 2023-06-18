import { useState, useEffect, useContext } from 'react'

import { Typography, Grid, Chip, IconButton, Button, Fab, AvatarGroup, Avatar, Icon, useTheme } from '@mui/material'
import { Add, Celebration, Delete, Edit, Done, HourglassTop } from '@mui/icons-material'

import { OccasionsContext } from '@/contexts/OccasionsContext'
import { PeopleContext } from '@/contexts/PeopleContext'
import { LedgerContext } from '@/contexts/LedgerContext.js'

import Card from '../Card.js'
import HorizontalGroup from '../HorizontalGroup.js'
import VerticalGroup from '../VerticalGroup.js'
import EditOccasion from './EditOccasion.js'
import Payouts from './Payouts.js'

export default function Occasions(props) {

    const theme = useTheme()

    const [editorOpen, setEditorOpen] = useState(false)
    const [editIsNew, setEditIsNew] = useState(false)
    const [editData, setEditData] = useState(null)

    const [payoutsOpen, setPayoutsOpen] = useState(false)

    const {occasions} = useContext(OccasionsContext)
    const {people} = useContext(PeopleContext)

    function editOccasion(occasion) {
        setEditorOpen(true)
        setEditIsNew(false)
        setEditData(occasion)
    }

    return (
        <>
            <EditOccasion open={editorOpen} onClose={() => { setEditorOpen(false) }} isNew={editIsNew} editData={editData} people={people} />
            <Payouts open={payoutsOpen} onClose={() => { setPayoutsOpen(false) }} />

            <Fab color="secondary" sx={{ position: "fixed", bottom: 96, right: 16, zIndex: 2 }} onClick={() => { setEditorOpen(true); setEditIsNew(true); setEditData(null) }}>
                <Add />
            </Fab>

            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", border: "none" }}>

                <HorizontalGroup style={{ gap: "10px" }}>
                    <Celebration fontSize="large" />
                    <Typography variant="h4">Occasions</Typography>
                </HorizontalGroup>

                <VerticalGroup style={{ width: "100%", gap: "15px", }}>

                    {occasions.length !== 0 && people.length !== 0 ?
                        occasions.map(occasion => {

                            const active = new Date(occasion.start_date) < new Date() && new Date(occasion.end_date) >= new Date()
                            const past = new Date(occasion.start_date) < new Date()

                            return (
                                <Card
                                    key={occasion._id}
                                    icon={
                                        <AvatarGroup spacing="small">
                                            {occasion.included_people.map(personId => {
                                                const personName = people.find(person => person._id === personId).name
                                                return (
                                                    <Avatar key={personId} sx={{ bgcolor: `${personName.toLowerCase()}.main`, height: 20, width: 20 }}><Icon /></Avatar>
                                                )
                                            })}
                                        </AvatarGroup>
                                    }
                                    title={occasion.name}
                                    subtitle={`${occasion.start_date} - ${occasion.end_date}`}
                                    subtitleIcon={
                                        active ? <HourglassTop fontSize='small' sx={{ color: theme.palette.text.secondary }} /> : (past ? <Done fontSize='small' sx={{ color: theme.palette.text.secondary }} /> : null)
                                    }
                                    //titleChip={<Chip label="Active" color="primary" variant="outlined" size="small" />}
                                    actions={<IconButton color="primary" onClick={() => { editOccasion(occasion) }}><Edit /></IconButton>} style={{ width: "100%" }}
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
                            )
                        })
                        : null}




                    {/* <Card
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

                            <Button variant="outlined" color="primary" onClick={() => { setPayoutsOpen(true) }} sx={{ borderRadius: "5px", width: "100%", height: "auto", }}>Payouts</Button>
                        </VerticalGroup>
                    </Card> */}
                </VerticalGroup>

            </div>
        </>
    )
}