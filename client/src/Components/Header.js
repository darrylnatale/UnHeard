import styled from "styled-components";
import { BsGem } from "react-icons/bs";
import Searchbar from "./Searchbar";


const Header = () => {
    return (
      <>
        <Wrapper>
          <StyledLogo>
            <Title>
              <span>U</span>
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
        <SearchSticky>
          <Searchbar />
        </SearchSticky>
      </>
    );
  };
  
  export default Header;
  
  const StyledLogo = styled.h1`
    font-family: "Zen Dots", cursive;
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
  