import { Slide, Divider, useTheme, Typography } from "@mui/material"

import VerticalGroup from "./VerticalGroup"
import HorizontalGroup from "./HorizontalGroup"

export default function Drawer(props) {

    const theme = useTheme();

    return (
        <Slide direction="up" in={props.open} mountOnEnter unmountOnExit style={{ position: "fixed", width: "100%", height: "100%", }}>
            <div style={{ position: "fixed", width: "100%", height: "auto", bottom: 0, background: theme.palette.background.default, zIndex: 100, padding: "0px 15px", marginBottom: 80 }}>

                <Divider style={{ width: "100%", marginBottom: "15px" }} />

                <VerticalGroup style={{ width: "100%", alignItems: "flex-start", gap: "15px", marginBottom: "16px" }}>

                    <HorizontalGroup>
                        <Typography variant="h4">{props.title}</Typography>
                    </HorizontalGroup>

                    {props.children}
                </VerticalGroup>

            </div>

        </Slide>
    )
}