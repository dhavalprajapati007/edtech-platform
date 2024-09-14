const { MSG91_API_KEY, MSG91_SENDER_ID, MSG91_TEMPLATE_ID, APP_LINK, MSG91_FLOW_ID } = process.env;

// export const sendAppLink = async (mobileNumber, message = null) => {
//     let messageText;

//     if(!message) {
//         messageText = `Download our app: ${APP_LINK}`;
//     }else {
//         messageText = message;
//     }

//     const data = {
//         template_id: MSG91_TEMPLATE_ID,
//         sender: MSG91_SENDER_ID,
//         short_url: 1,
//         mobiles: `91${mobileNumber}`,
//     }

//     console.log(data,'payloadMSG91');

//     const headers = {
//         "authkey": MSG91_API_KEY,
//         "Content-Type": "application/json",
//     };

//     try {
//         const response = await fetch("https://api.msg91.com/api/v5/flow", {
//             method: "POST",
//             headers,
//             body: JSON.stringify(data),
//         });

//         console.log(response,'responseMSG91');

//         if (!response.ok) {
//             const errorResponse = await response.json();
//             throw new Error(`Failed to send SMS: ${errorResponse.message}`);
//         }
    
//         return true;
//     }catch (error) {
//         console.error("Failed to send SMS:", error);
//         throw new Error("Failed to send SMS");
//     }
// };

const http = require("https");

export const sendAppLink = async (mobileNumber, message = null) => {
    let messageText;

    if(!message) {
        messageText = `Download our app: ${APP_LINK}`;
    }else {
        messageText = message;
    }

    // const payload = {
    //     template_id: MSG91_TEMPLATE_ID,
    //     sender: MSG91_SENDER_ID,
    //     short_url: "1", // Assuming you want short URLs enabled
    //     mobiles: `91${mobileNumber}`,
    //     VAR1: "VALUE 1",
    //     VAR2: "VALUE 2",
    // };

    const payload = {
        flow_id: MSG91_FLOW_ID,
        sender: MSG91_SENDER_ID,
        recipients: [{
            mobiles: `91${mobileNumber}`,
            var: message
        }],
    }

    const options = {
        method: "POST",
        hostname: "control.msg91.com",
        port: null,
        path: "/api/v5/flow/",
        headers: {
            "Authkey": MSG91_API_KEY,
            "accept": "application/json",
            "content-type": "application/json",
        },
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                const response = JSON.parse(body.toString());

                if(res.statusCode === 200) {
                    resolve(true);
                }else {
                    reject(new Error(`Failed to send SMS: ${response.message}`));
                }
            });
        });

        req.on("error", function (error) {
            reject(error);
        });

        req.write(JSON.stringify(payload));
        req.end();
    });
};
