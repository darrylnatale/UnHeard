import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../Context";

const ArtistButton = ({thumb, name, fxn, profile}) => {
    
    return ( <ArtistContainer onClick={() => {fxn()}}>
            <Image src={thumb}/>
            <p>{name}</p>
            <p>{profile}</p>
    </ArtistContainer> );
}
 
export default ArtistButton;

const ArtistContainer = styled.button`
display: flex;
width: 400px;
border: 1 px solid lightblue;
border-radius: 15px;
background: none;
margin: 5px;
padding: 5px;
`

const Image = styled.img`
width: 125px;
`