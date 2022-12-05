import styled from "styled-components";
import { Context } from "../Context";
import { useContext , useEffect} from "react";
import Tracks from "./Tracks";
import filter from "../Functions/filter";

const SpotifyResults = () => {

    const { animationIndex, setAnimationIndex, allSpotifyTrackNames, spotifyAlbums, spotifyContent, setAllSpotifyTrackNames, selectedArtist} = useContext(Context)
    const uniqueSpotify = [...new Set(allSpotifyTrackNames)];
    const filteredSongs = filter(uniqueSpotify)
    
    useEffect(() => {
      let index2 = 0
      const interval = setInterval(() => {
        
        setAnimationIndex(prevIndex => prevIndex + 1 )
        index2++      
        if (index2 > 3300){
          return clearInterval(interval)
        }
      }, 40 )
    
    }, [])

    let message = ""

    if (uniqueSpotify.length < 40){
      message = "Hmm, that's it?"
    } else if (uniqueSpotify.length < 200){
      message = "Not too bad! "
    } else {
      message = "That's a lot!"
    }


    return ( 
        <div>
          <div>We found {filteredSongs.length} tracks by {selectedArtist.artistName} on Spotify...</div>
          <div>{message}</div>
          <Animation>
        {animationIndex > 1 && filteredSongs.slice(0,animationIndex).map((testTrack, index) => {
           
            return <Track key={index}>{testTrack} </Track>
           
        })}
    </Animation>
        </div>
        
         );
}
 
export default SpotifyResults;

const Animation = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 10px;
`;

const Track = styled.div`
  margin: 0 10px;
`;

const Image = styled.img`
  width: 100px;
  border-radius: 15px;
`;

const Album = styled.div`
  display: flex;
  flex-wrap: wrap;
`;