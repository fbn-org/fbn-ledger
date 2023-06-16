import { Paper, Typography } from '@mui/material'

function Card(props) {
    return (
        <Paper variant="outlined" sx={{ height: "auto", width: "100%", padding: "15px", borderRadius: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", ...props.style }}>
            {props.title || props.icon ?
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
                    {props.icon}
                    <Typography variant="h5">{props.title}</Typography>
                </div>
                : null}
            {props.children}
        </Paper>
    )
}

export default Card 