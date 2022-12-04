import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    
    const {user, isAuthenticated} = useAuth0()
    
    return ( 
        isAuthenticated && (
            <>
            {user?.picture &&  <img src={user.picture}/>}
            <h2>{user?.name}</h2>
            <ul>
                {Object.keys(user).map((objKey, index) => {
                    return <li key={index}>{user[objKey]} </li>
                })}
            </ul>
            </>

        ) 
    );
}
 
export default Profile;