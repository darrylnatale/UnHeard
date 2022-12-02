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

    

    return ( <>
    Hm, you're the first to search for that musician. 
    We need to confirm the spotify artist. 
    Did you mean {
      exactSpotifyNameMatch.discogsArtistIdState((match, index) => {
        return (<>
        <button key={Math.floor(Math.random() * 14000000000)} onClick={() => {storeMatchedArtistIds(match.id, match.name, discogsArtistIdState); getAllContentFromSpotifyAndDiscogs(match.id, match.name, discogsArtistIdState)}}>
        <p>{match.name}?</p>
        {match.images[0] && <Image src={match.images[0].url}/>}
        </button>
        </>)
      })
    }
    
    
    
    
    {/* <button onClick={() => {getAllContentFromSpotifyAndDiscogs("6UiNFle7UUqz6t9x8A6i0A", "nahh", 86857)}}>No, show me more</button> */}
    
    </> );
}
 
export default ArtistVerification;

const Image = styled.img`
width: 125px;
`