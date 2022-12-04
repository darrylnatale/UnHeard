import { Context } from "../Context";
import { useContext } from "react";
import styled from "styled-components";
import Results from "./Results";
import getDiscogsContent from "../Functions/getDiscogsContent";
import getSpotifyContent from "../Functions/getSpotifyContent";

const ArtistVerification = ({getAllContentFromSpotifyAndDiscogs}) => {
  
  const {exactSpotifyNameMatch, discogsArtistIdState, setDiscogsContent, setSelectedArtist} = useContext(Context)
      
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
              console.log(data.data)
              
              setSelectedArtist(data.data)
              const spotifyArtistId = data.data.spotifyArtistId
              const discogsArtistId = data.data.discogsArtistId
              const artistName = data.data.artistName    

              getSpotifyContent(spotifyArtistId, artistName)
              getDiscogsContent(discogsArtistId)
            }
           })
           .catch((err) => console.log(err));
      }

      const storeSingleArtistId = (artistName) => {
        
        fetch(`/storeSingleArtistId`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({artistName, discogsArtistIdState}),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 200){
              console.log("single artistId input in mongo, now show results")
              
              
              const discogsArtistId = data.data.discogsArtistId
              getDiscogsContent(discogsArtistId)
              
    
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
                <StyledArtistButton key={match.id} onClick={() => {storeMatchedArtistIds(match.id, match.name, discogsArtistIdState); }}>
                  <p>{match.name}</p>
                  {match.images[0] && <Image src={match.images[0].url}/>}
                </StyledArtistButton><h2>?</h2>
                </>
               )
        })
     }
  
    <button onClick={() => {storeSingleArtistId(exactSpotifyNameMatch[0].name, discogsArtistIdState)}}>
      No, none of these are right
      </button>
    
    
    
    </StyledArtistVerificationContainer> );
}
 
export default ArtistVerification;

const Image = styled.img`
width: 125px;
border-radius: 15px;
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
border-radius: 20px;
background: none;
margin: 5px;
padding: 5px;
`