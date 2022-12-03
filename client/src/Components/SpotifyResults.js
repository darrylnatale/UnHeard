import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";

const SpotifyResults = () => {

    const {allSpotifyTrackNames, selectedArtist, animationIndex, spotifyAlbums} = useContext(Context)
    
    return ( 
    
        
        <div>
            {allSpotifyTrackNames.length && <h1>We found {allSpotifyTrackNames.length} tracks by {selectedArtist} on Spotify</h1>}
            <Animation>
          
            {animationIndex > 1 && allSpotifyTrackNames.slice(0,animationIndex).map((testTrack) => {
                return <Track key={Math.floor(Math.random() * 16000000)}>
                            {testTrack} 
                        </Track>    
                        })}
            </Animation>
          <h1>... on {spotifyAlbums.length} albums</h1>
          <Album>
            {spotifyAlbums.map((spotifyAlbum) => {
                return <>
                        <Image src={spotifyAlbum.images[0].url} key={Math.floor(Math.random() * 16000000)}/>
                        {/* <div>{spotifyAlbum.name}</div> */}
                        </>
                         })}
        </Album>
        </div>
         );
}
 
export default SpotifyResults;

const Animation = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 10px;
`

const Track = styled.div`
margin: 0 10px;
`


const Image = styled.img`
width: 100px;
`

const Album = styled.div`
  display: flex;
  flex-wrap: wrap;
`