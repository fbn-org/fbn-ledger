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
import OccasionCard from './OccasionCard.js'

export default function Occasions(props) {

    const theme = useTheme()

    const [editorOpen, setEditorOpen] = useState(false)
    const [editIsNew, setEditIsNew] = useState(false)
    const [editData, setEditData] = useState(null)

    const [payoutsOpen, setPayoutsOpen] = useState(false)

    const { occasions } = useContext(OccasionsContext)
    const { people } = useContext(PeopleContext)

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
                            
                            return <OccasionCard key={occasion._id} occasion={occasion} people={people} />
                            
                        })
                        : null}

                </VerticalGroup>

            </div>
        </>
    )
} 