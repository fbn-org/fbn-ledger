

export default function VerticalGroup(props) {
    return (
        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", ...props.style }}>
            {props.children}
        </div>
    )
}