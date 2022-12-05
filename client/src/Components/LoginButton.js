import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const LoginButton = () => {
    
    const {loginWithRedirect, isAuthenticated} = useAuth0()
    
    return ( 
        !isAuthenticated && (
        <StyledButton onClick={() => loginWithRedirect()}>
    Sign In
        </StyledButton>) 
    );
}
 
export default LoginButton;

const StyledButton = styled.button`
font-family: "Zen Dots", cursive;
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  width: 100px;
  height: 20px;
  border-radius: 5px;
  background: white;
  margin: 15px;

  
  border: none;
`

