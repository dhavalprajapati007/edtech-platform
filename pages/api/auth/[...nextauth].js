import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { requestAPI } from "../../../helpers/apiHelper";


const getStudentDetail = async (user) => {
    try {
        let body = { 
            email: user.email,
            fullName: user.name
        };

        let URL = `${process.env.NEXTAUTH_URL}api/auth/google-signin`;

        let reqObj = {
            method: 'POST',
            body: JSON.stringify(body)
        };

        // get the data
        let data = await requestAPI(URL,reqObj);

        if(data && data?.statusCode == 200) {
            return data.data;
        } else {
            console.log(data.message,"error");
            throw new Error(data.message);
        }
    } catch (e) {
        console.log(e,"error");
        throw new Error(e);
    }
}

export default NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            },
        }),
        CredentialsProvider({
            name : "Credentials",
            async authorize(credentials, req){
                let data;
                try {
                    let body = { 
                        email: credentials.email,
                        password: credentials.password
                    };
                    let URL = `${process.env.NEXTAUTH_URL}api/auth/email-login`;

                    let reqObj = {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                        referrerPolicy: "no-referrer",
                        mode: "cors",
                        cache: "no-cache",
                        credentials: "same-origin"
                    };

                    // get the data
                    data = await requestAPI(URL,reqObj);                
                    if(data && data?.statusCode == 200) {
                        return data;
                    } else {
                        console.log(data,"error");
                        throw data;
                    }
                } catch (error) {
                    console.log(error,"error");
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if(account.provider === 'google') {
                user.studentData = await getStudentDetail(user);
            } else {
                user.studentData = user.data
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token = { 
                    data : user.studentData
                };
            }
            return token
        },
        async session({ session, user, token }) {
            session.studentData = token.data
            return session
        },
    }
})