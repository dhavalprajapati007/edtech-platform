const ProgressBar = ({ bgcolor, completed, remainingBg }) => {
    const containerStyles = {
        width: '100%',
        backgroundColor: remainingBg,
        margin: "15px 0px",
        borderRadius: '4.5px',
        height: '12px'
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 500,
        fontSize: '10px'
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>
                    {`${completed}%`}
                </span>
            </div>
        </div>
    );
};
  
export default ProgressBar;