import styled from "styled-components";
import { Context } from "../Context";
import { useContext, useEffect } from "react";
import Albums from "./Albums";
import Tracks from "./Tracks";

const DiscogsResults = () => {

    const {discogsContent, discogsArtistIdState, setAllDiscogsTrackNames} = useContext(Context)
    const discogsSiteName = "the internet"
    const discogsTrackNameArray = []
    
    

    if(discogsContent.masters){
        discogsContent.masters.mainReleases.roles.main.forEach((discogsAlbumDetail) => {
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
 
    if(discogsContent.releases){
        discogsContent.releases.roles.main.forEach((discogsAlbumDetail) => {
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



useEffect(() => {
    setAllDiscogsTrackNames(uniqueDiscogs)
}, [])




    return (  <>
    {/* <Albums apiData={discogsContent}/> */}
    <Tracks uniqueTracks={uniqueDiscogs} site={discogsSiteName}/>
        <div>
        
   
       
       
       
       
       </div>
       </> );
}
 
export default DiscogsResults;



