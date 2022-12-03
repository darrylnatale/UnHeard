import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";

const DiscogsResults = () => {

    const {discogsData, animationIndex, selectedArtist, discogsArtistIdState} = useContext(Context)
    
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
        <div>
        <h1>There are {uniqueDiscogs.length} tracks by {selectedArtist} on Discogs</h1>
       
       <Animation>
        {animationIndex > 1 && uniqueDiscogs.slice(0,animationIndex).map((testTrack) => {
           
            return <Track>{testTrack} </Track>
           
        })}
    </Animation>
   
       
       
       
       
   <h1>... on {discogsData.length} albums</h1>
   <Album>
    {discogsData.masters.mainReleases.roles.main.map((item,index) => {
         
         return <div key={Math.floor(Math.random(index) * 160000000)}>
           {/* <div>{discogsData.artist} - {item.title}</div> */}
           <Image src={item.images[0].uri} />
           </div>  
       })
       }
       </Album>
       
       </div>
       </> );
}
 
export default DiscogsResults;

const Animation = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 10px;
`

const Image = styled.img`
width: 100px;
`

const Album = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Track = styled.div`
margin: 0 10px;
`