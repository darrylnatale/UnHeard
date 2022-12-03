import styled from "styled-components";
import { Context } from "../Context";
import { useContext, useEffect } from "react";
import Albums from "./Albums";
import Tracks from "./Tracks";

const DiscogsResults = () => {

    const {discogsData, discogsArtistIdState, setAllDiscogsTrackNames} = useContext(Context)
    const discogsSiteName = "Discogs"
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



useEffect(() => {
    setAllDiscogsTrackNames(uniqueDiscogs)
}, [])




    return (  <>
    {/* <Albums apiData={discogsData}/> */}
    <Tracks uniqueTracks={uniqueDiscogs} site={discogsSiteName}/>
        <div>
        
   
       
       
       
       
       </div>
       </> );
}
 
export default DiscogsResults;



