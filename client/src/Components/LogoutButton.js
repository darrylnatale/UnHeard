import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const LogoutButton = () => {
    const {logout, isAuthenticated} = useAuth0()
    return ( 
        isAuthenticated && (
        <StyledButton onClick={() => logout()}>
        Sign Out
        </StyledButton>) 
    );
}

export default LogoutButton;
const StyledButton = styled.button`

font-size: 12px;
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  width: 100px;
  height: 20px;
  border-radius: 5px;
  background: white;
  margin: 15px;

  
  border: none;
  `