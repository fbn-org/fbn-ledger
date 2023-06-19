import { useEffect, useState } from 'react'

import { Avatar, AvatarGroup, Typography, IconButton, Grid, Button, Icon, useTheme } from '@mui/material'
import { Edit, Done, HourglassTop } from '@mui/icons-material'

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
    const editCallback = props.editCallback

    const startDate = dayjs.utc(occasion.start_date).local().format("MMMM Do, YYYY")
    const endDate = dayjs.utc(occasion.end_date).local().format("MMMM Do, YYYY")

    const active = new Date(occasion.start_date) < new Date() && new Date(occasion.end_date) >= new Date()
    const past = new Date(occasion.start_date) < new Date()

    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        fetch(`/api/ledger/fetchTransactions/${occasion._id}`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                setTransactions(data)
            })
    }, [occasion])

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
            subtitle={`${startDate} - ${endDate}`}
            subtitleIcon={
                active ? <HourglassTop fontSize='small' sx={{ color: theme.palette.text.secondary }} /> : (past ? <Done fontSize='small' sx={{ color: theme.palette.text.secondary }} /> : null)
            }
            //titleChip={<Chip label="Active" color="primary" variant="outlined" size="small" />}
            actions={<IconButton color="primary" onClick={() => { editCallback(occasion) }}><Edit /></IconButton>} style={{ width: "100%" }}
        >

            <VerticalGroup style={{ width: "100%", gap: "15px", }}>
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
                                ${transactions.reduce((total, transaction) => total + transaction.total, 0)}
                            </Typography>
                            <Typography variant="body2">
                                total spend
                            </Typography>
                        </VerticalGroup>
                    </Grid>

                </Grid>

                <Button variant="outlined" color="primary" onClick={() => { props.payoutsCallback(occasion) }} sx={{ borderRadius: "5px", width: "100%", height: "auto", }}>Payouts</Button>
            </VerticalGroup>
        </Card>
    )
}