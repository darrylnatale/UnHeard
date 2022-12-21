import styled from "styled-components";
import { BsGem } from "react-icons/bs";
import Searchbar from "./Searchbar";
import { Link, useHistory } from "react-router-dom";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import "../css/styles.css"

const Header = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();




    return (<>
      <StyledCredentials>
      {error && <p>Authentication Error</p>}
        {!error && isLoading && <p>Loading...</p>}
        {!error && !isLoading && 
          <>
            {isAuthenticated && <ProfileLink to="/profile">Profile</ProfileLink>}
            <LoginButton />
            <LogoutButton />
          </>
        }
        </StyledCredentials>
      
        <StyledLink to="/" >
        <Wrapper>
        
          <StyledLogo>
            <Title>
              <span>Q</span>
              <span>N</span>
              <span>H</span>
              <span>E</span>
              <span>A</span>
              <span>R</span>
              <span>D</span>
              <Gem>
                <BsGem />
              </Gem>
            </Title>
          </StyledLogo>
          
        </Wrapper>
        </StyledLink>
        <SearchSticky>
          <Searchbar />
        </SearchSticky>
      
      </>
      
    );
  };
  
  export default Header;
  
  const StyledCredentials = styled.div`
  text-align: right;
  font-size: 12px;
  `
  const ProfileLink = styled(Link)`
  text-decoration: none;
  padding: 3px 25px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  width: 100px;
  height: 20px;
  border-radius: 5px;
  background: white;
  margin: 15px;
  border: none;
  color: black;
  
  `
  
  const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  `
  const StyledLogo = styled.div`
    
    
  
  `;
  
  const Wrapper = styled.div`
    width: 100%;
    background-color: #e9ecef;
    color: white;
    text-shadow: 1px 1px 2px black;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  `;
  
  const SearchSticky = styled.div`
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 4000;
    width: 100%;
    background-color: #e9ecef;
  `;
  
  const Gem = styled.span`
    color: black;
  `;
  
  const Title = styled.div`
    display: flex;
    width: 800px;
    font-size: 50px;
    padding-top: 30px;
    justify-content: space-between;
  `;
  