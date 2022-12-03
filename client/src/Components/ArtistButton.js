import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../Context";


const ArtistButton = ({thumb, name, checkIfInMongoHandler, profile, discogsArtistId}) => {
    const {setDiscogsArtistIdState} = useContext(Context)
    
    let formattedProfileText = profile
    
    if (formattedProfileText.length > 300){
        formattedProfileText = formattedProfileText.slice(0, 99) + "..."
    }

    

    
      
    
    return ( <StyledArtistButton onClick={() => {checkIfInMongoHandler() ; setDiscogsArtistIdState(discogsArtistId)}}>
            <Image src={thumb}/>
            <div>
            <Name>{name}</Name>
            <p>{formattedProfileText}</p>
            <p>{discogsArtistId}</p>
            </div>
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
const Name = styled.h1`
font-size: 30px;
`
const Image = styled.img`
width: 125px;
border-radius: 15px;
`