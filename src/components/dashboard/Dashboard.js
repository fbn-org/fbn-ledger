import { useState } from 'react'

import { AttachMoney, AutoAwesome, Celebration, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, Person, Receipt } from '@mui/icons-material'
import { Chip, Container, Grid, Paper, Typography, useTheme } from '@mui/material'

import Card from '../Card.js'
import HorizontalGroup from '../HorizontalGroup.js'
import VerticalGroup from '../VerticalGroup.js'

export default function Dashboard() {

    const theme = useTheme()

    return (
        <>

            <div style={{ width: "100%", height: "100%", marginBottom: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", border: "none" }}>

                <HorizontalGroup style={{ gap: "10px" }}>
                    <AutoAwesome fontSize="large" color="colin" />
                    <Typography variant="h4">FBN Ledger</Typography>
                </HorizontalGroup>

                <Card style={{ gap: "10px" }} title="Recent Transactions" icon={<AttachMoney />}>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", gap: "5px" }}>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "5px" }}>
                                    <Chip label="Colin" size="small" color="colin" variant="outlined" />
                                    <Typography variant="body1">
                                        paid
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "5px" }}>
                                    <Typography variant="h6">
                                        $32.16
                                    </Typography>
                                </div>

                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "5px" }}>
                                    <Typography variant="body2" sx={{ marginTop: "5px" }}>
                                        for asian court
                                    </Typography>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>

                </Card>

                <Card
                    title="philly trip"
                    icon={<Celebration />}
                    subtitle="2023-06-10 to 2023-06-12"
                    titleChip={<Chip label="Active" color="primary" variant="outlined" size="small" />}
                    style={{ width: "100%" }}
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

                <Card style={{ gap: "10px" }} title="People" icon={<Person />}>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", borderColor: theme.palette.colin.main }}>
                                <Typography variant="body1">
                                    Colin
                                </Typography>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <Typography variant="h6">
                                        $32.16
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                    <KeyboardDoubleArrowDown fontSize="small" color="error" />
                                    <Typography variant="caption" color="error.light">-$20.16</Typography>
                                </div>
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", borderColor: theme.palette.eric.main }}>
                                <Typography variant="body1">
                                    Eric
                                </Typography>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <Typography variant="h6">
                                        $32.16
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                    <KeyboardDoubleArrowDown fontSize="small" color="error" />
                                    <Typography variant="caption" color="error.light">-$20.16</Typography>
                                </div>
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", borderColor: theme.palette.hudson.main }}>
                                <Typography variant="body1">
                                    Hudson
                                </Typography>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <Typography variant="h6">
                                        $32.16
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                    <KeyboardDoubleArrowDown fontSize="small" color="error" />
                                    <Typography variant="caption" color="error.light">-$20.16</Typography>
                                </div>
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", borderColor: theme.palette.matty.main }}>
                                <Typography variant="body1">
                                    Matty
                                </Typography>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <Typography variant="h6">
                                        $90.14
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                    <KeyboardDoubleArrowUp fontSize="small" color="success" />
                                    <Typography variant="caption" color="success.light">+$60.16</Typography>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>

                </Card>

            </div >
        </>
    )
}
