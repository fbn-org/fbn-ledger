import { AttachMoney, Celebration, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, Person, Receipt } from '@mui/icons-material'
import { Chip, Container, Grid, Paper, Typography, useTheme } from '@mui/material'

import Card from '@/components/Card'
import Section from '@/components/Section'

export default function Home() {

    const theme = useTheme()

    return (
        <>
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", border: "none" }}>

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

                <Card style={{ gap: "10px" }} title="Active Occasion" icon={<Celebration />}>

                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>


                        <Grid container spacing={2} >
                            <Grid item xs={6}>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                                    <Typography variant="h6">
                                        2023-06-10
                                    </Typography>
                                    <Typography variant="body2">
                                        start date
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item xs={6}>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                                    <Typography variant="h6">
                                        2023-06-12
                                    </Typography>
                                    <Typography variant="body2">
                                        end date
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item xs={6}>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                                    <Typography variant="h6">
                                        15
                                    </Typography>
                                    <Typography variant="body2">
                                        transactions
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item xs={6}>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                                    <Typography variant="h6">
                                        $120.50
                                    </Typography>
                                    <Typography variant="body2">
                                        total value
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>


                        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "10px" }}>
                            <Typography variant="caption" color="text.disabled">
                                9dc342e1-da42-4a6c-b140-68b3960ce5fe
                            </Typography>
                        </div>
                    </div>

                </Card >

                <Card style={{ gap: "10px" }} title="People" icon={<Person />}>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", borderColor: theme.palette.colin.main }}>
                                <Typography variant="h6">
                                    Colin
                                </Typography>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Typography variant="h6">
                                        $32.16
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                    <KeyboardDoubleArrowDown fontSize="small" color="error" />
                                    <Typography variant="subtitle2" color="error.light">-$20.16</Typography>
                                </div>
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", borderColor: theme.palette.eric.main }}>
                                <Typography variant="h6">
                                    Eric
                                </Typography>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Typography variant="h6">
                                        $32.16
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                    <KeyboardDoubleArrowDown fontSize="small" color="error" />
                                    <Typography variant="subtitle2" color="error.light">-$20.16</Typography>
                                </div>
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", borderColor: theme.palette.hudson.main }}>
                                <Typography variant="h6">
                                    Hudson
                                </Typography>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Typography variant="h6">
                                        $32.16
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                    <KeyboardDoubleArrowDown fontSize="small" color="error" />
                                    <Typography variant="subtitle2" color="error.light">-$20.16</Typography>
                                </div>
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card style={{ borderRadius: "5px", padding: "10px", borderColor: theme.palette.matty.main }}>
                                <Typography variant="h6">
                                    Matty
                                </Typography>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Typography variant="h6">
                                        $90.14
                                    </Typography>
                                </div>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: "5px" }}>
                                    <KeyboardDoubleArrowUp fontSize="small" color="success" />
                                    <Typography variant="subtitle2" color="success.light">-$60.16</Typography>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>

                </Card>

            </div >
        </>
    )
}
