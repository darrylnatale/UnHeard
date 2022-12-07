import styled from "styled-components";
import { Context } from "../Context";
import { useContext , useEffect} from "react";
import Tracks from "./Tracks";
import filter from "../Functions/filter";

const SpotifyResults = () => {

    const { animationIndex, setAnimationIndex, allSpotifyTrackNames, spotifyAlbums, spotifyContent, setAllSpotifyTrackNames, selectedArtist} = useContext(Context)
    const uniqueSpotify = [...new Set(allSpotifyTrackNames)];
    const filteredSongs = filter(uniqueSpotify).sort()

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

    


    return ( <>
        { allSpotifyTrackNames ?
          <StyledSpotifyResults>
            
            <div>
            <h1>We found <span>{uniqueSpotify.length}</span> tracks by {selectedArtist.artistName} on Spotify...</h1></div>
            
            <Animation>
            
        {animationIndex > 1 && uniqueSpotify.slice(0,animationIndex).map((testTrack, index) => {
           
            return <Track key={index}>{testTrack} / </Track>
           
        })}

    </Animation>
    
        </StyledSpotifyResults>
        : <>LOADING</>}
         </>);
}
 
export default SpotifyResults;

const StyledSpotifyResults = styled.div`
margin: 10px 0;
border-radius: 10px;
padding: 20px 0; 
border: 1px solid black;
width: 100%;
min-height: 40%;
max-height: 40%;
max-width: 80%;
overflow:auto;
font-family: "Zen Dots", cursive;

h1{ 
  font-size: 18px;
}
span{
  color: red;
  font-size: 30px;
}

`
const Animation = styled.div`
margin: 10px 0; 
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height:80%;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

const Track = styled.p`
  margin: 0 10px 0 5px;
font-size: 18px;

`;

const Row = styled.div`
  width: auto;
`;

const Album = styled.div`
  display: flex;
  flex-wrap: wrap;
`;