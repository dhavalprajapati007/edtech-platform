import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

export const renderPreview = (files,setFiles) => {
    return files.map((file) => (
        <div key={file.name} style={{ display: 'inline-block', position: 'relative' }}>
            <img
                src={typeof(file) === 'string' ? file : URL.createObjectURL(file)}
                alt={file.name}
                style={{ 
                    height: '100px', 
                    marginRight: '5px', 
                    marginLeft: '10px' 
                }}
            />
            <button
                type="button"
                onClick={() => removeImage(files,file,setFiles)}
                style={{
                    position: 'absolute',
                    top: '1px',
                    right: '5px',
                    backgroundColor: 'transparent',
                    color: 'red',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer'
                }}
            >
                <CancelRoundedIcon />
            </button>
        </div>
    ));
};

const removeImage = (files,image,setFiles) => {
    const filteredImages = files.filter((file) => file !== image);
    setFiles(filteredImages);
};

export const handleDrop = (acceptedFiles,setFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
};