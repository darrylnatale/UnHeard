import styled from "styled-components";
import { Context } from "../Context";
import { useContext , useEffect} from "react";
import Tracks from "./Tracks";
import filter from "../Functions/filter";

const SpotifyResults = () => {

    const { animationIndex, setAnimationIndex, allSpotifyTrackNames, spotifyAlbums, spotifyContent, setAllSpotifyTrackNames, selectedArtist} = useContext(Context)
    const uniqueSpotify = [...new Set(allSpotifyTrackNames)];
    const filteredSongs = filter(uniqueSpotify)

    let speed = 1000

    if (filteredSongs.length > 10){
      speed = 500
    } else if (filteredSongs.length > 50){
      speed = 250
    } else if (filteredSongs.length > 100){
      speed = 20
    } else if (filteredSongs.length > 250){
      speed = 50
    }

    

    useEffect(() => {
      let index2 = 0
      const interval = setInterval(() => {
        
        setAnimationIndex(prevIndex => prevIndex + 1 )
        index2++      
        if (index2 > filteredSongs.length){
          return clearInterval(interval)
        }
      }, 10 )
    
    }, [])

    let message = ""

    if (uniqueSpotify.length < 40){
      message = "Hmm, that's it?"
    } else if (uniqueSpotify.length < 200){
      message = "Not too bad! "
    } else {
      message = "That's a lot!"
    }


    return ( <>
        { allSpotifyTrackNames ?
          <StyledSpotifyResults>
            
            <div>We found {filteredSongs.length} tracks by {selectedArtist.artistName} on Spotify...</div>
            <div>{message}</div>
            <Animation>
            
        {animationIndex > 1 && filteredSongs.slice(0,animationIndex).map((testTrack, index) => {
           
            return <Track key={index}>{testTrack} </Track>
           
        })}

    </Animation>
    
        </StyledSpotifyResults>
        : <>LOADING</>}
         </>);
}
 
export default SpotifyResults;

const StyledSpotifyResults = styled.div`
border: 1px solid black;
width: 100%;
min-height: 30%;
max-height: 30%;
overflow:auto;
font-family: "Zen Dots", cursive;

`
const Animation = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height:80%;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

const Track = styled.span`
  margin: 0 10px;
  text-align: center;

`;

const Row = styled.div`
  width: auto;
`;

const Album = styled.div`
  display: flex;
  flex-wrap: wrap;
`;