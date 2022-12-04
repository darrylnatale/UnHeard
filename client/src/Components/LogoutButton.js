import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const {logout, isAuthenticated} = useAuth0()
    return ( 
        isAuthenticated && (
        <button onClick={() => logout()}>
        Sign Out
        </button>) 
    );
}
https://www.youtube.com/results?search_query=venise+%22roissy%22
export default LogoutButton;