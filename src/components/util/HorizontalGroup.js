export default function HorizontalGroup(props) {
    return (
        <div
            style={{
                width: 'auto',
                height: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                ...props.style
            }}
        >
            {props.children}
        </div>
    );
}
