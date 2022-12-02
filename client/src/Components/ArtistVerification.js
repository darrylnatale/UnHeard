import { Context } from "../Context";
import { useContext } from "react";
import styled from "styled-components";

const ArtistVerification = ({fxn2}) => {
  
  
  const {exactSpotifyNameMatch, xx, setCorrectGuess} = useContext(Context)

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
          body: JSON.stringify({spotifyArtistId, artistName, xx}),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 200){
              console.log("artistIds input in mongo, now show results")
              console.log(spotifyArtistId)
              console.log(artistName)
              console.log(xx)
              
              fxn2(spotifyArtistId, artistName, xx)
            }
           })
           .catch((err) => console.log(err));
      }

    

    return ( <>
    Hm, you're the first to search for that musician. 
    We need to confirm the spotify artist. 
    Did you mean 
    <button onClick={() => {storeMatchedArtistIds(exactSpotifyNameMatch[0].id, exactSpotifyNameMatch[0].name, xx); fxn2(1243, "char", 3445)}}>
    <p>{exactSpotifyNameMatch[0].name}?</p>
    {exactSpotifyNameMatch[0].images[0] && <Image src={exactSpotifyNameMatch[0].images[0].url}/>}
    </button>
    {/* <button onClick={() => {fxn2("6UiNFle7UUqz6t9x8A6i0A", "nahh", 86857)}}>No, show me more</button> */}
    
    </> );
}
 
export default ArtistVerification;

const Image = styled.img`
width: 125px;
`