import mongoose from "mongoose";
import { getSession } from "next-auth/react";
import { apiError } from "../../helpers/responseHelper";
import { publicAPI } from "../../utils/data";
const { UNAUTHORIZED, JWT_AUTH_TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const StudentModel = require("../../models/student");

const verifyAndFindUser = async(token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_AUTH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return reject(new Error("InvalidToken"));
            }

            if (!decoded) return reject(new Error("TokenExpired"));

            StudentModel.findById(decoded.tokenObject._id, (err, user) => {
                if (err) return reject(err);

                if (user === null || user === undefined) return reject(new Error("TokenExpired"));

                resolve(user);
            });
        });
    });
}

const withMiddleware = (apiEndpoint, Model) => async (req, res) => {
    // Common logic that needs to be executed before the API endpoint is called
    console.log('Connecting to database...');
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        )
    }

    if(!mongoose.connection.readyState) {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    const session = await getSession({ req })

    let URL = req.url?.includes("?") ? req.url?.split("?")[0] : req.url;

    if(!publicAPI.includes(URL)) {
        //check authorization token exist or not
        const token = req?.headers?.authorization;
        let userData;
        
        if (!token?.length) return apiError(res, "TokenNotFound", UNAUTHORIZED);

        try {
            const user = await verifyAndFindUser(token);
            req.user = user;
            req.token = token;
            req.db = { Model };
            req.session = session;
        } catch (err) {
            apiError(res, err.message, UNAUTHORIZED);
        }
    } else {
        req.session = session
        req.db = { Model };
    }

    // Call the API endpoint and return the result
    return apiEndpoint(req, res);
};
  
module.exports = withMiddleware;