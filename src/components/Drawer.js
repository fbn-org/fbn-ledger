import { Slide, Divider, useTheme, Typography } from "@mui/material"

import VerticalGroup from "./VerticalGroup"
import HorizontalGroup from "./HorizontalGroup"

export default function Drawer(props) {

    const theme = useTheme();

    return (
        <Slide direction="up" in={props.open} mountOnEnter unmountOnExit style={{ position: "relative" }}>
            <div style={{ position: "fixed", width: "100vw", maxHeight: "100vh", left: 0, overflowY: "scroll", bottom: 0, background: theme.palette.background.default, zIndex: 100, padding: "0px 15px 80px 15px", paddingBottom: "80px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>

                <VerticalGroup style={{ width: "100%", maxWidth: theme.breakpoints.values.sm, }}>

                    <Divider style={{ width: "100%", marginBottom: "15px" }} />

                    <VerticalGroup style={{ width: "100%", alignItems: "flex-start", gap: "15px", marginBottom: "16px", padding: "0px 5px"}}>

                        <HorizontalGroup style={{ width: "100%",}}>
                            <VerticalGroup style={{ alignItems: "flex-start" }}>
                                <Typography variant="h4" sx={{ flexGrow: 1 }}>{props.title}</Typography>
                                {props.subtitle ?
                                    <Typography variant="subtitle1" color="text.secondary">{props.subtitle}</Typography>
                                    : null}
                            </VerticalGroup>
                            <HorizontalGroup style={{ height: "100%", gap: "5px", flexGrow: 1, justifyContent: "flex-end", alignItems: "flex-start", alignSelf: "flex-start" }}>
                                {props.actions}
                            </HorizontalGroup>
                        </HorizontalGroup>

                        {props.children}
                    </VerticalGroup>

                </VerticalGroup>

            </div>

        </Slide>
    )
}