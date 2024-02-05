import "./style.sass"

export default function EndAdornmentInput({ onClickMax, isMax, fullWidth, placeholder = "Enter the amount", ...rest }: any) {
    // console.log(rest, "restttt")
    return (
        <div className={`end-adornment-input ${fullWidth ? 'fullWidth' : ''}`}>
            <input type="number" placeholder={placeholder} {...rest} />
            {isMax ? <div>
                <span onClick={onClickMax}>MAX</span>
            </div> : null}
        </div>
    )
}
