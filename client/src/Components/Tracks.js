import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";
import filter from "../Functions/filter";

const Tracks = ({uniqueTracks, site}) => {
    
    const {timerIndex, selectedArtist} = useContext(Context)

    const filteredSongs = filter(uniqueTracks)
    console.log(selectedArtist)
    
    return ( <>
    <h1>There are {filteredSongs.length} tracks by {selectedArtist.artistName} on {site}</h1>
       
       <Animation>
        {timerIndex > 1 && filteredSongs.slice(0,timerIndex).map((testTrack, index) => {
           
            return <Track key={index}>{testTrack} </Track>
           
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