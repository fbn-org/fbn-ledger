import { useState, useEffect, useContext } from 'react'

import { Typography, Grid, Chip, IconButton, Button, Fab, AvatarGroup, Avatar, Collapse, useTheme } from '@mui/material'
import { Add, Celebration, Delete, Edit, Done, HourglassTop, AccessTime, ExpandMore, ExpandLess } from '@mui/icons-material'

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
    const [payoutsOccasion, setPayoutsOccasion] = useState(null)

    const { occasions } = useContext(OccasionsContext)
    const { people } = useContext(PeopleContext)
    const { ledger } = useContext(LedgerContext)

    function editOccasion(occasion) {
        setEditorOpen(true)
        setEditIsNew(false)
        setEditData(occasion)
    }

    function showPayouts(occasion) {
        setPayoutsOpen(true)
        setPayoutsOccasion(occasion)
    }

    const typeIcons = {
        "active": <HourglassTop fontSize='medium' sx={{ color: theme.palette.text.secondary }} />,
        "past": <Done fontSize='medium' sx={{ color: theme.palette.text.secondary }} />,
        "upcoming": <AccessTime fontSize='medium' sx={{ color: theme.palette.text.secondary }} />
    }

    return (
        <>
            <EditOccasion open={editorOpen} onClose={() => { setEditorOpen(false); setEditData(null) }} isNew={editIsNew} editData={editData} people={people} />
            <Payouts onClose={() => { setPayoutsOccasion(null) }} occasion={payoutsOccasion} people={people} open={payoutsOpen} setOpen={setPayoutsOpen} />

            <Fab color="secondary" sx={{ position: "fixed", bottom: 96, right: 16, zIndex: 2 }} onClick={() => { setEditorOpen(true); setEditIsNew(true); setEditData(null) }}>
                <Add />
            </Fab>

            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", border: "none" }}>

                <HorizontalGroup style={{ gap: "10px" }}>
                    <Celebration fontSize="large" />
                    <Typography variant="h4">Occasions</Typography>
                </HorizontalGroup>

                <VerticalGroup style={{ width: "100%", gap: "15px", }}>

                    <OccasionGroup occasionsType="active" icon={typeIcons["active"]} occasions={occasions.filter(occasion => occasion.timeState === "active")} people={people} ledger={ledger} editCallback={editOccasion} payoutsCallback={showPayouts} defaultOpen={true} />
                    <OccasionGroup occasionsType="upcoming" icon={typeIcons["upcoming"]} occasions={occasions.filter(occasion => occasion.timeState === "upcoming")} people={people} ledger={ledger} editCallback={editOccasion} payoutsCallback={showPayouts} defaultOpen={occasions.filter(occasion => occasion.timeState === "active").length === 0} />
                    <OccasionGroup occasionsType="past" icon={typeIcons["past"]} occasions={occasions.filter(occasion => occasion.timeState === "past")} people={people} ledger={ledger} editCallback={editOccasion} payoutsCallback={showPayouts} defaultOpen={false} />

                </VerticalGroup>

            </div>
        </>
    )
}

function OccasionGroup(props) {

    const occasionsType = props.occasionsType
    const occasions = props.occasions;
    const people = props.people;
    const ledger = props.ledger
    const editOccasion = props.editCallback;
    const showPayouts = props.payoutsCallback;
    const icon = props.icon

    const [open, setOpen] = useState(occasions.length !== 0 ? props.defaultOpen : false)

    useEffect(() => {
        if(props.defaultOpen){
            setOpen(occasions.length !== 0 ? props.defaultOpen : false)
        }
    }, [occasions, props.defaultOpen])

    return (
        <VerticalGroup style={{ width: "100%", }}>
            <HorizontalGroup style={{ width: "100%", gap: "10px" }}>
                {icon}
                <Typography variant="h5">{occasionsType.charAt(0).toUpperCase() + occasionsType.slice(1)}</Typography>
                <HorizontalGroup style={{ width: "auto", flexGrow: 1, justifyContent: "flex-end" }}>
                    <IconButton color="secondary" size="medium" onClick={() => { setOpen(open => !open) }} disabled={occasions.length === 0}>
                        {!open ? <ExpandMore /> : <ExpandLess />}
                    </IconButton>
                </HorizontalGroup>
            </HorizontalGroup>
            <Collapse in={open} style={{ width: "100%" }} unmountOnExit mountOnEnter>
                <VerticalGroup style={{ marginTop: "15px", width: "100%", gap: "15px", marginBottom: occasionsType === "past" ? "80px" : 0 }}>

                    {occasions.length !== 0 && people.length !== 0 ?
                        occasions.map(occasion => {

                            return <OccasionCard key={occasion._id} occasion={occasion} people={people} ledger={ledger} editCallback={editOccasion} payoutsCallback={showPayouts} showPayoutsButton={occasionsType === "past"} disableStats={occasionsType === "upcoming"} />

                        })
                        : null}

                </VerticalGroup>
            </Collapse>
        </VerticalGroup>
    )
}