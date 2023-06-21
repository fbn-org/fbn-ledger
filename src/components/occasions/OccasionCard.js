import { useEffect, useState } from 'react'

import { Avatar, AvatarGroup, Typography, IconButton, Grid, Button, Icon, useTheme } from '@mui/material'
import { Edit, Done, HourglassTop, AccessTime } from '@mui/icons-material'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);
dayjs.extend(utc);

import VerticalGroup from '../VerticalGroup'
import HorizontalGroup from '../HorizontalGroup'
import Card from '../Card'

export default function OccasionCard(props) {

    const theme = useTheme()

    const people = props.people
    const occasion = props.occasion
    const ledger = props.ledger
    const editCallback = props.editCallback
    const payoutsCallback = props.payoutsCallback
    const showPayoutsButton = props.showPayoutsButton
    const disableStats = props.disableStats

    const startDate = dayjs.utc(occasion.start_date).local().format("MMMM Do, YYYY")
    const endDate = dayjs.utc(occasion.end_date).local().format("MMMM Do, YYYY")

    const timeState = occasion.timeState

    const [transactions, setTransactions] = useState([])
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        setTransactions(ledger.filter(transaction => transaction.occasion === occasion._id))
    }, [occasion])

    useEffect(() => {
        // calculate time until event starts
        if (timeState === "upcoming") {
            const now = dayjs().utc()
            const start = dayjs.utc(occasion.start_date)
            setTimeLeft(start.diff(now, 'hour'))
        }
    }, [])

    return (
        <Card
            key={occasion._id}
            icon={
                <AvatarGroup spacing="small" onClick={() => {timeState === "active" && payoutsCallback ? payoutsCallback(occasion) : null}}>
                    {occasion.included_people.map(personId => {
                        const personName = people.find(person => person._id === personId).name
                        return (
                            <Avatar key={personId} sx={{ bgcolor: `${personName.toLowerCase()}.main`, height: 20, width: 20 }}><Icon /></Avatar>
                        )
                    })}
                </AvatarGroup>
            }
            title={occasion.name}
            subtitle={`${startDate} - ${endDate}`}
            // subtitleIcon={
            //     subtitleIcons[timeState]
            // }
            //titleChip={<Chip label="Active" color="primary" variant="outlined" size="small" />}
            actions={editCallback ? <IconButton color="primary" onClick={() => { editCallback(occasion) }}><Edit /></IconButton> : null}
            style={{ width: "100%" }}
        >

            <VerticalGroup style={{ width: "100%", gap: "15px", }}>
                {!disableStats ?
                    <Grid container spacing={2}>

                        <Grid item xs={6}>
                            <VerticalGroup style={{ alignItems: "flex-start" }}>
                                <Typography variant="h6">
                                    {transactions.length}
                                </Typography>
                                <Typography variant="body2">
                                    transactions 
                                </Typography>
                            </VerticalGroup>
                        </Grid>

                        <Grid item xs={6}>
                            <VerticalGroup style={{ alignItems: "flex-start" }}>
                                <Typography variant="h6">
                                    ${transactions.reduce((total, transaction) => total + transaction.total, 0).toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    total spend
                                </Typography>
                            </VerticalGroup>
                        </Grid>

                    </Grid>
                    :
                    <VerticalGroup style={{ width: "100%", alignItems: "flex-start", }}>
                        <Typography variant="h6">
                            {timeLeft > 0 ? `${timeLeft} hours` : "< 1 hour"}
                        </Typography>
                        <Typography variant="body2">
                            until start
                        </Typography>
                    </VerticalGroup>
                }

                {showPayoutsButton ?
                    <Button variant="outlined" color="primary" onClick={() => { payoutsCallback(occasion) }} sx={{ borderRadius: "5px", width: "100%", height: "auto", }}>Payouts</Button>
                    : null
                }
            </VerticalGroup>
        </Card>
    )
}