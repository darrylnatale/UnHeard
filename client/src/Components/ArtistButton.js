import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../Context";


const ArtistButton = ({thumb, name, checkIfInMongoHandler, profile, discogsArtistId}) => {
    
    const {setDiscogsArtistIdState, discogsArtistIdState} = useContext(Context)
    
    let formattedProfileText = profile
    
    if (formattedProfileText.length > 300){
        formattedProfileText = formattedProfileText.slice(0, 299) + "..."
    }

    
    return ( <StyledArtistButton onClick={() => {
                    checkIfInMongoHandler() ; 
                    setDiscogsArtistIdState(discogsArtistId) ;
                    console.log("buttonclicke",discogsArtistIdState)}}>
                <StyledImage src={thumb}/>
                <>
                    <StyledArtistName>{name}</StyledArtistName>
                    <StyledProfileText>{formattedProfileText}</StyledProfileText>
                </>
            </StyledArtistButton> );
}
 
export default ArtistButton;

const StyledArtistButton = styled.button`
display: flex;
justify-content: center;
align-items: center;
width: 400px;
height: 200px;
border: 1 px solid lightblue;
border-radius: 20px;
background: none;
margin: 5px;

`
const StyledArtistName = styled.h1`
font-size: 30px;
`
const StyledImage = styled.img`
width: 125px;
border-radius: 15px;
`

const StyledProfileText = styled.p`

`