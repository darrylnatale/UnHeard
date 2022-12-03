import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../Context";


const ArtistButton = ({thumb, name, checkIfInMongoHandler, profile, discogsArtistId}) => {
    const {setDiscogsArtistIdState} = useContext(Context)
    
    let formattedProfileText = profile
    
    if (formattedProfileText.length > 100){
        formattedProfileText = formattedProfileText.slice(0, 99) + "..."
    }

    

    
      
    
    return ( <StyledArtistButton onClick={() => {checkIfInMongoHandler() ; setDiscogsArtistIdState(discogsArtistId)}}>
            <Image src={thumb}/>
            <p>{name}</p>
            <p>{formattedProfileText}</p>
            <p>{discogsArtistId}</p>
    </StyledArtistButton> );
}
 
export default ArtistButton;

const StyledArtistButton = styled.button`
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