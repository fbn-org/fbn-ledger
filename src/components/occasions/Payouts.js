import { Chip, IconButton, Typography } from "@mui/material"
import { Close, KeyboardDoubleArrowRight } from "@mui/icons-material"

import Drawer from "../Drawer.js"
import VerticalGroup from "../VerticalGroup.js"
import HorizontalGroup from "../HorizontalGroup.js"

export default function Payouts(props) {
    return (
        <Drawer title="Payouts" subtitle="Philly trip" open={props.open} actions={<IconButton onClick={props.onClose} color="secondary"><Close/></IconButton>} >

            <VerticalGroup style={{ width: "100%", alignItems: "flex-start", gap: "15px" }}>

                <HorizontalGroup style={{ width: "100%", gap: "5px", justifyContent: "center" }}>
                    <Chip label="Colin" color="colin" variant="outlined" sx={{flexBasis: "35%"}} />
                    <KeyboardDoubleArrowRight />
                    <Typography variant="h6" sx={{flexBasis: "30%", textAlign: "center"}}>$120</Typography>
                    <KeyboardDoubleArrowRight />
                    <Chip label="Matty" color="matty" variant="outlined" sx={{flexBasis: "35%"}} />
                </HorizontalGroup>

                <HorizontalGroup style={{ width: "100%", gap: "5px", justifyContent: "center" }}>
                    <Chip label="Eric" color="eric" variant="outlined" sx={{flexBasis: "35%"}}/>
                    <KeyboardDoubleArrowRight />
                    <Typography variant="h6" sx={{flexBasis: "30%", textAlign: "center"}}>$10.23</Typography>
                    <KeyboardDoubleArrowRight />
                    <Chip label="Hudson" color="hudson" variant="outlined" sx={{flexBasis: "35%"}}/>
                </HorizontalGroup>

                <HorizontalGroup style={{ width: "100%", gap: "5px", justifyContent: "center" }}>
                    <Chip label="Colin" color="colin" variant="outlined" sx={{flexBasis: "35%"}}/>
                    <KeyboardDoubleArrowRight />
                    <Typography variant="h6" sx={{flexBasis: "30%", textAlign: "center"}}>$120</Typography>
                    <KeyboardDoubleArrowRight />
                    <Chip label="Eric" color="eric" variant="outlined" sx={{flexBasis: "35%"}}/>
                </HorizontalGroup>

            </VerticalGroup>

        </Drawer>
    )
}