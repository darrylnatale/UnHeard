import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";

const Tracks = ({uniqueTracks}) => {

    const {animationIndex, selectedArtist} = useContext(Context)
    const filters = ["Remaster", "- Live", "Remix", "Edit", "Dub", "Live at", "Mix", "World Tour", "Vocal", "12", "Club", "Version"];

    const filteredSongs = uniqueTracks.filter(song => 
  filters.every(filter => !song.includes(filter))

);
    return ( <>
    <h1>There are {filteredSongs.length} tracks by {selectedArtist} on Discogs</h1>
       
       <Animation>
        {animationIndex > 1 && filteredSongs.slice(0,animationIndex).map((testTrack) => {
           
            return <Track>{testTrack} </Track>
           
        })}
    </Animation>
    </> );
}
 
export default Tracks;


const Animation = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 10px;
`
const Track = styled.div`
margin: 0 10px;
`