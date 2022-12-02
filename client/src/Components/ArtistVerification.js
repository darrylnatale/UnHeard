import { Context } from "../Context";
import { useContext } from "react";
import styled from "styled-components";

const ArtistVerification = ({getAllContentFromSpotifyAndDiscogs}) => {
  
  
  const {exactSpotifyNameMatch, discogsArtistIdState, setCorrectGuess} = useContext(Context)

  const showMore = (exactSpotifyNameMatch) => {
    if (exactSpotifyNameMatch === "yes"){
      setCorrectGuess((prev) => true)
    }
    else {
      setCorrectGuess((prev) => false)
    } 
  }
    
    
    
    const storeMatchedArtistIds = (spotifyArtistId, artistName) => {
        
        fetch(`/storeMatchedArtistIds`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({spotifyArtistId, artistName, discogsArtistIdState}),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 200){
              console.log("artistIds input in mongo, now show results")
              console.log(spotifyArtistId)
              console.log(artistName)
              
              
              getAllContentFromSpotifyAndDiscogs(spotifyArtistId, artistName, discogsArtistIdState)
            }
           })
           .catch((err) => console.log(err));
      }

    

    return ( <StyledArtistVerificationContainer>
    <h2>Hm, you're the first to search for that musician. 
    We need to confirm the spotify artist. 
    Did you mean</h2>
    {
      exactSpotifyNameMatch.map((match, index) => {
        return (<>
                <StyledArtistButton key={index} onClick={() => {storeMatchedArtistIds(match.id, match.name, discogsArtistIdState); getAllContentFromSpotifyAndDiscogs(match.id, match.name, discogsArtistIdState)}}>
                  <p>{match.name}</p>
                  {match.images[0] && <Image src={match.images[0].url}/>}
                </StyledArtistButton><h2>?</h2>
                </>
               )
        })
     }
  
    
    </StyledArtistVerificationContainer> );
}
 
export default ArtistVerification;

const Image = styled.img`
width: 125px;
`
const StyledArtistVerificationContainer = styled.div`
text-align: center;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

const StyledArtistButton = styled.button`
display: flex;
width: 400px;
border: 1 px solid lightblue;
border-radius: 15px;
background: none;
margin: 5px;
padding: 5px;
`