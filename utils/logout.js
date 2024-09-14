import { signOut } from "next-auth/react";

export const handleLogout = async(props) => {
    // Wrap the cookie clearing code inside a Promise
    signOut();
    props.push("/");
    // redirect user to login page after clear the cookie
};
