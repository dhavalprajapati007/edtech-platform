import crypto from 'crypto';

const PAGINATION_LIMIT = process.env.PAGINATION_LIMIT;

const algorithm = 'aes-256-cbc';
const encryptionKey = 'c2e5a7a4335d4e5ef10c8fa28b922c2a';
const iv = Buffer.alloc(16, 0);

export const validationMessageKey = (apiTag, error) => {
    let key = (error.details[0]?.context.key).toUpperCase();
    let type = error.details[0].type.split(".");
    type = type[1].toUpperCase();
    key = `${apiTag} ${key} ${type} : ${error.details[0].message}`;
    return key;
};

export const getPageAndLimit = (page, limit) => {
    if (!page) page = 1;
    if (!limit) limit = PAGINATION_LIMIT;
    let limitCount = limit * 1;
    let skipCount = (page - 1) * limitCount;
    return { limitCount, skipCount };
};

export const transform = (data) => {
    if(data.filter(item => item.answer === true).length > 1){
        let index = data.reduce((prev, el, i) => { 
            if(el.answer === true) {
                prev.push(getOptionChar(i))
            }
            return prev
        },[]);
        return index.join();
    } else{
        let index = data.findIndex(el => el.answer === true );
        return getOptionChar(index);
    }
};

export const getOptionChar = (index) => {
    switch (index) {
        case 0:
            return 'A'
        case 1:
            return 'B'
        case 2:
            return 'C'
        case 3:
            return 'D'
        default:
            throw new Error('Invalid Choice Index')
    }
};

export const getSelectedAnswerLetter = (choices, selectedAnswer) => {
    let selectedIds = Array.isArray(selectedAnswer) ? selectedAnswer.map(ans => ans) : [selectedAnswer];
    let selectedOption = [];
    for (let i = 0; i < choices.length; i++) {
        if(selectedIds.includes(choices[i]._id)) {
            selectedOption.push(i);
        }
    }

    if(!selectedOption.length) {
        return null; // no match found
    }else {
        let index = selectedOption.map((val) => getOptionChar(val));
        return index.join();
    }
}

export const formatTime = (time) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

export const handleContextMenu = (e) => {
    // prevent the right-click menu from appearing
    e.preventDefault();
};

export const handleKeyDown = (e) => {
    // 123 is the keycode for F12
    if(e.keyCode === 123) {
        e.preventDefault();
    }
};

export const encrypt = (text) => {
    let cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};
  
export const decrypt = (encryptedData) => {
    let decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
};