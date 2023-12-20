import { Typography } from '@mui/material';

function Section({ style, icon, title, children }) {
    return (
        <div
            style={{
                height: 'auto',
                width: '100%',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                ...style
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '5px'
                }}
            >
                {icon}
                <Typography variant="h5">{title}</Typography>
            </div>
            {children}
        </div>
    );
}

export default Section;
