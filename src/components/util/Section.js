import { Paper, Typography } from '@mui/material'

function Section(props) {
    return (
        <div style={{ height: "auto", width: "100%", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", ...props.style }}>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "5px" }}>
                {props.icon}
                <Typography variant="h5">{props.title}</Typography>
            </div>
            {props.children}
        </div>
    )
}

export default Section 