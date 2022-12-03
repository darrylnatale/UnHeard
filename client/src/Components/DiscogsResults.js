import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";
import Albums from "./Albums";
import Tracks from "./Tracks";

const DiscogsResults = () => {

    const {discogsData, discogsArtistIdState} = useContext(Context)
    
    const discogsTrackNameArray = []
    
    

if(discogsData.masters){
  discogsData.masters.mainReleases.roles.main.forEach((discogsAlbumDetail) => {
    discogsAlbumDetail.tracklist.forEach((track) => {
      if (track.artists){
      track.artists.forEach((artistOnTrack) => {
        
        if (artistOnTrack.id === discogsArtistIdState){
          discogsTrackNameArray.push(track.title)
        }
      })
        
    } else {
      discogsTrackNameArray.push(track.title)
    }
    })
  })
}
 
if(discogsData.releases){
    discogsData.releases.roles.main.forEach((discogsAlbumDetail) => {
      discogsAlbumDetail.tracklist.forEach((track) => {
        if (track.artists){
        track.artists.forEach((artistOnTrack) => {
          
          if (artistOnTrack.id === discogsArtistIdState){
            discogsTrackNameArray.push(track.title)
          }
        })
          
      } else {
        discogsTrackNameArray.push(track.title)
      }
      })
    })
  }

const uniqueDiscogs = [...new Set(discogsTrackNameArray)];



    return (  <>
    {/* <Albums apiData={discogsData}/> */}
    <Tracks uniqueTracks={uniqueDiscogs}/>
        <div>
        
   
       
       
       
       
       </div>
       </> );
}
 
export default DiscogsResults;



