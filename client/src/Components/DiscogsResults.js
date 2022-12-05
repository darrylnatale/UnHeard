import styled from "styled-components";
import { Context } from "../Context";
import { useContext, useEffect } from "react";
import Albums from "./Albums";
import Tracks from "./Tracks";
import filter from "../Functions/filter";

const DiscogsResults = () => {

    const { animationIndex, setAnimationIndex, discogsAlbums, discogsContent, setAllDiscogsTrackNames, selectedArtist, allDiscogsTrackNames} = useContext(Context)
    const uniqueDiscogs = [...new Set(allDiscogsTrackNames)];
    const filteredSongs = filter(uniqueDiscogs)
    
    useEffect(() => {
      let index2 = 0
      const interval = setInterval(() => {
        
        setAnimationIndex(prevIndex => prevIndex + 1 )
        index2++      
        if (index2 > 3300){
          return clearInterval(interval)
        }
      }, 1000 )
    
    }, [])

//     const {discogsContent, discogsArtistIdState, setAllDiscogsTrackNames} = useContext(Context)
    
//     const discogsTrackNameArray = []
    
    

//     if(discogsContent.masters){
//         discogsContent.masters.mainReleases.roles.main.forEach((discogsAlbumDetail) => {
//             discogsAlbumDetail.tracklist.forEach((track) => {
//             if (track.artists){
//                 track.artists.forEach((artistOnTrack) => {
//                     if (artistOnTrack.id === discogsArtistIdState){
//                         discogsTrackNameArray.push(track.title)
//                         }
//                     })            
//             } else {
//                 discogsTrackNameArray.push(track.title)
                
//             }
//             })
//         })
//     }
 
//     if(discogsContent.releases){
//         discogsContent.releases.roles.main.forEach((discogsAlbumDetail) => {
//             discogsAlbumDetail.tracklist.forEach((track) => {
//                 if (track.artists){
//                     track.artists.forEach((artistOnTrack) => {
//                         if (artistOnTrack.id === discogsArtistIdState){
//                             discogsTrackNameArray.push(track.title)
//                         }
//                     })     
//                 } else {
//                     discogsTrackNameArray.push(track.title)
//                 }
//             })
//         })
//     }


// const uniqueDiscogs = [...new Set(discogsTrackNameArray)];



// useEffect(() => {
//     setAllDiscogsTrackNames(uniqueDiscogs)
// }, [])




    return ( <>
    { allDiscogsTrackNames ?
    <StyledDiscogsResults>
          <div>
            <h1>Out of a total of <span>{uniqueDiscogs.length}</span> tracks :</h1>
          </div>
          <Animation>
              {animationIndex > 1 && uniqueDiscogs.slice(0,animationIndex).map((testTrack, index) => {
           
            return <Track key={index}>{testTrack} / </Track>
              })   
            }
          </Animation>
          
    </StyledDiscogsResults> : 
    <>Searching The Rest of The Web... This Might Take Even Longer... </>
    }</>
    );
}
 
export default DiscogsResults;

const StyledDiscogsResults = styled.div`
margin: 10px 0;
padding: 20px 0; 
border: 1px solid black;
border-radius: 10px;
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height:80%;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`

const Track = styled.div`
margin: 0 5px;
font-size: 18px;
`



