import { Chip, Container, Grid, Paper, Typography, useTheme } from '@mui/material';

import {
    AttachMoney,
    Celebration,
    KeyboardDoubleArrowDown,
    KeyboardDoubleArrowUp,
    Person,
    Receipt
} from '@mui/icons-material';

import Dashboard from '@/components/dashboard/Dashboard.js';
import Ledger from '@/components/ledger/Ledger.js';
import Occasions from '@/components/occasions/Occasions.js';

export default function Index(props) {
    const selectedPage = props.selectedPage;

    const pages = [<Dashboard key="dash" />, <Occasions key="occasions" />, <Ledger key="ledger" />];

    return <>{pages[selectedPage]}</>;
}
