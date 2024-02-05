import './style.sass';
interface IRefreshIcon {
    isDarkMode?: boolean,
    onClick?: () => void,
}

function RefreshIcon({ isDarkMode = true, onClick = () => { } }: IRefreshIcon) {
    return (
        <div className='reficon'>
            <img
                style={{ cursor: "pointer" }}
                src={`/images/icons/sync-icon-${isDarkMode ? "white" : "dark"}.png`}
                alt="sync"
                onClick={onClick}
            />
        </div>
    )
}

export default RefreshIcon