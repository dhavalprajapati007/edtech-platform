import { encrypt } from "./helper";

//send success response
export const successapi = async (res, message, statusCode = 200, data = null, extras = null) => {
	const response = {
		message,
		data,
		statusCode,
	};

	if (extras) {
		Object.keys(extras).forEach((key) => {			
			if ({}.hasOwnProperty.call(extras, key)) 
			{
				response[key] = extras[key];
			}
		});
	};

	// return res.send(response);
	
	let encryptedRes = encrypt(JSON.stringify(response));

	return res.send(encryptedRes);
};

// send error response
export const apiError = async (res, message, statusCode = 500) => {
	const response = {
		statusCode,
		message,
	};

	let encryptedRes = encrypt(JSON.stringify(response));
	
	return res.status(statusCode).send(encryptedRes);
};