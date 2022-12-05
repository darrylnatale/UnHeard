import styled from "styled-components";

import { useAuth0 } from "@auth0/auth0-react";
import { Context } from "../Context";
import { useContext, useEffect } from "react";
const Profile = () => {
    
    const {user, isAuthenticated} = useAuth0()
    const {lastSearched, mongoUser, setMongoUser} = useContext(Context)
    
    

    return ( 
        isAuthenticated && (
            <StyledContainer>
        
            <h1>Welcome, {user?.name}</h1>
            <p>Your last searched artist was: </p>
            {lastSearched && 
            <>
            <p>{lastSearched.name}</p>
            <img src={lastSearched.images[0].uri}/>
            </>}
            <p>Check back here soon for more features!</p>
            <ul>
                {/* {Object.keys(user).map((objKey, index) => {
                    return <li key={index}>{user[objKey]} </li>
                })} */}
            </ul>
            </StyledContainer>

        ) 
    );
}
 
export default Profile;

const StyledContainer = styled.div`
    text-align: center;
  font-family: "Zen Dots", cursive;
  font-size: 22px;
  margin-top: 20px;
  line-height: 2;
  
`
