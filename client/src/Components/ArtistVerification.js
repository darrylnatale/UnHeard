import { Context } from "../Context";
import { useContext } from "react";
import styled from "styled-components";
import Results from "./Results";
import getDiscogsContent from "../Functions/getDiscogsContent";
import getSpotifyContent from "../Functions/getSpotifyContent";

const ArtistVerification = ({getDiscogsMasters, getSpotifyContent}) => {
  
  const {exactSpotifyNameMatch, discogsArtistIdState, setExactSpotifyNameMatch, setDiscogsContent,setIsInMongo, setSelectedArtist} = useContext(Context)
      
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
              setExactSpotifyNameMatch(null)
              setIsInMongo(true)
              setSelectedArtist(data.data)
              
              const spotifyArtistId = data.data.spotifyArtistId
              const discogsArtistId = data.data.discogsArtistId
              const artistName = data.data.artistName    

              getSpotifyContent(spotifyArtistId, artistName)
              getDiscogsMasters(discogsArtistId)
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
              
              setExactSpotifyNameMatch(null)
              const discogsArtistId = data.data.discogsArtistId
              getDiscogsMasters(discogsArtistId)
              
    
            }
           })
           .catch((err) => console.log(err));
      }

     




    return ( <StyledArtistVerificationContainer>
    
    
    <h2>You're the first to search for that musician!</h2>
    <h2>We need to confirm we're matching the right Spotify artist. </h2>
    <h2>Did you mean:</h2>
    <ArtistButtonContainer>
    {
      exactSpotifyNameMatch.map((match, index) => {
        return (
                <StyledArtistButton key={match.id} onClick={() => {storeMatchedArtistIds(match.id, match.name, discogsArtistIdState); }}>
                  {match.images[0] && <StyledImage src={match.images[0].url}/>}
                  <StyledArtistName>{match.name}</StyledArtistName>
                  
                </StyledArtistButton>
                
               )
        })
     }
     <StyledArtistButton onClick={() => {storeSingleArtistId(exactSpotifyNameMatch[0].name, discogsArtistIdState)}}>
      No, none of these are right
      </StyledArtistButton>
  </ArtistButtonContainer>
    
    
    
    
    </StyledArtistVerificationContainer> );
}
 
export default ArtistVerification;

const ArtistButtonContainer = styled.div`
max-width: 1200px;
justify-content: center;
display: flex;
flex-wrap: wrap;
`

const StyledArtistVerificationContainer = styled.div`
text-align: center;
line-height: 2;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

`

const StyledArtistButton = styled.button`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-family: "Zen Dots", cursive;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  width: 425px;
  height: 250px;
  border-radius: 20px;
  background: white;
  margin: 25px 25px 0 25px;
  padding: 20px;
  border: none;
  
`;

// const StyledArtistButton = styled.button`
// display: flex;
// width: 400px;
// border: 1 px solid lightblue;
// border-radius: 20px;
// background: none;
// margin: 5px;
// padding: 5px;
// `





const StyledArtistName = styled.h1`
  font-size: 15px;
  overflow: auto;
  text-decoration: underline;
  align-self: center;
`;
const StyledImage = styled.img`
  width: 180px;
  border-radius: 15px;
  padding: 15px;
`;

const Bio = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const StyledProfileText = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;