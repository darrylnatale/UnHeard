import styled from "styled-components";
import { BsGem } from 'react-icons/bs';

const Header = () => {
    return ( <>
    
    
    <Logo>UnHeard <BsGem /></Logo>
    <p>Find hidden gems by your favourite musicians</p>
    </> );
}


export default Header;

const Logo = styled.h1`
`