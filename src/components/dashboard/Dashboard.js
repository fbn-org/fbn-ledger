import { useState, useEffect, useContext } from 'react'

import { AttachMoney, AutoAwesome, Celebration, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, Person } from '@mui/icons-material'
import { Chip, Container, Grid, Paper, Typography, useTheme, Avatar, Icon } from '@mui/material'

import { OccasionsContext } from '@/contexts/OccasionsContext'
import { PeopleContext } from '@/contexts/PeopleContext'
import { LedgerContext } from '@/contexts/LedgerContext.js'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);
dayjs.extend(utc);

import Card from '../Card.js'
import HorizontalGroup from '../HorizontalGroup.js'
import VerticalGroup from '../VerticalGroup.js'

import OccasionCard from '../occasions/OccasionCard.js'

export default function Dashboard() {

    const theme = useTheme()

    const { occasions } = useContext(OccasionsContext)
    const { people } = useContext(PeopleContext)
    const { ledger } = useContext(LedgerContext)

    const [recentTransactions, setRecentTransactions] = useState([])
    const [featuredOccasion, setFeaturedOccasion] = useState(null)
    const [peopleStats, setPeopleStats] = useState({})

    useEffect(() => {
        setRecentTransactions(ledger.slice(0, 3))

        // find the most recent active occasion, and if there isn't find the next upcoming occasion
        let activeOccasions = occasions.filter(occasion => occasion.timeState === "active")
        let upcomingOccasions = occasions.filter(occasion => occasion.timeState === "upcoming")

        if (activeOccasions.length > 0) {
            setFeaturedOccasion(activeOccasions[0])
        } else if (upcomingOccasions.length > 0) {
            setFeaturedOccasion(upcomingOccasions[0])
        } else {
            setFeaturedOccasion(null)
        }

        // calculate people stats
        let stats = {}
        people.forEach(person => {
            stats[person._id] = {
                name: person.name,
                totalSpend: 0,
                offset: 0
            }
        })

        ledger.forEach(transaction => {
            let total = transaction.total
            stats[transaction.payer].offset += total
            let extra = 0
            if (transaction.type_attrs.tax !== "") {
                extra += parseFloat(transaction.type_attrs.tax)
            }
            if (transaction.type_attrs.tip !== "") {
                extra += parseFloat(transaction.type_attrs.tip)
            }
            total -= extra

            Object.keys(transaction.type_attrs.people_items).forEach(p => {
                let personTotal = transaction.type_attrs.people_items[p].reduce((acc, item) => acc + parseFloat(item), 0)
                let weight = personTotal / total
                stats[p].totalSpend += (personTotal + (extra * weight))
            })
        })

        people.forEach(person => {
            stats[person._id].offset -= stats[person._id].totalSpend
        })

        setPeopleStats(stats)


    }, [occasions, people, ledger])

    return (
        <>
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", border: "none" }}>

                <HorizontalGroup style={{ gap: "10px" }}>
                    <AutoAwesome fontSize="large" color="colin" />
                    <Typography variant="h4">FBN Ledger</Typography>
                </HorizontalGroup>

                {recentTransactions && recentTransactions.length > 0 ?
                    <Card style={{ gap: "10px" }} title="Recent Transactions" icon={<AttachMoney />}>

                        <Grid container spacing={2}>

                            {recentTransactions.map(transaction => {

                                const date = dayjs.utc(transaction.date).local().format("MM-DD-YYYY")
                                const payer = people.find(person => person._id === transaction.payer).name

                                return (
                                    <Grid key={transaction._id} item xs={6}>
                                        <Card
                                            title={`$${transaction.total}`}
                                            subtitle={date}
                                            icon={<Avatar sx={{ bgcolor: `${payer.toLowerCase()}.main`, height: 20, width: 20 }}><Icon /></Avatar>}
                                            style={{ borderRadius: "10px", padding: "10px" }}
                                        />
                                    </Grid>
                                )
                            })
                            }

                        </Grid>

                    </Card>
                    : null}

                {featuredOccasion ?
                    <OccasionCard occasion={featuredOccasion} people={people} showPayoutsButton={false} disableStats={featuredOccasion.timeState === "upcoming"} />
                    : null}

                <Card style={{ gap: "10px" }} title="People" icon={<Person />}>

                    <Grid container spacing={2}>
                        {Object.keys(peopleStats).map(person => {

                            const data = peopleStats[person]

                            return (
                                <Grid key={data.name} item xs={6}>
                                    <Card style={{ borderRadius: "10px", padding: "10px", borderColor: theme.palette[data.name.toLowerCase()].main }}>
                                        <Typography variant="body1">
                                            {data.name}
                                        </Typography>
                                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Typography variant="h6">
                                                ${data.totalSpend.toFixed(2)}
                                            </Typography>
                                        </div>
                                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                            {data.offset > 0 ?
                                                <KeyboardDoubleArrowUp fontSize="small" color="success" />
                                                :
                                                <KeyboardDoubleArrowDown fontSize="small" color="error" />
                                            }
                                            <Typography variant="caption" color={data.offset > 0 ? "success.light" : "error.light"}>{data.offset > 0 ? "+" : "-"}${data.offset.toFixed(2).replace("-","")}</Typography>
                                        </div>
                                    </Card>
                                </Grid>
                            )
                        })}


                    </Grid>

                </Card>

            </div >
        </>
    )
}
