import styled from "styled-components";
import { BsGem } from 'react-icons/bs';
import Searchbar from "./Searchbar";

const Header = () => {
    return ( 
    <>
        <StyledLogo>UnHeard <BsGem /></StyledLogo>
        <p>Find hidden gems by your favourite musicians</p>
        <Searchbar /> 
    </> );
}


export default Header;

const StyledLogo = styled.h1`




`