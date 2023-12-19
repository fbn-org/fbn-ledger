import { Container } from '@mui/material';

export default function BaseLayout({ children }) {
    return (
        <Container
            maxWidth="sm"
            sx={{
                height: '100vh',
                width: '100%',
                display: 'flex',
                padding: '0px',
                margin: 'auto',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                WebkitOverflowScrolling: 'touch'
            }}
        >
            {children}
        </Container>
    );
}
