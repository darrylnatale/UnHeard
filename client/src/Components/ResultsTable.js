import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";

const ResultsTable = () => {
  console.log("resultstableloaded")
    const {allData, setAllData} = useContext(Context)
    console.log("alldata",allData)
    const combinedAlbums = [].concat(...allData.albums);
    const combinedTracks = [].concat(...allData.tracks);
    console.log("combinedalbums",combinedAlbums)
    console.log("combinedtracks",combinedTracks)
    

    function compare(a, b) {
      if (a.trackName < b.trackName) {
        return -1;
      }
      if (a.trackName > b.trackName) {
        return 1;
      }
      return 0;
    }

    const compared = () => {
      console.log("click")
      setAllData(prevState => ({
        ...prevState,
        tracks: combinedTracks.sort(compare)
      }))
      

    }
    

    

      
    //   setAllData(prevState => ({
    //     ...prevState,
    //     albums: combinedAlbums
    //   }))


      
  if (allData.albums && allData.artistName){
    
  return (
    <table>
      <thead>
        <tr>
          <th>Tracks<button onClick={() => compared()}>filter</button></th>
          <th>Appears On</th>
          <th>Link</th>
          <th>YouTube Link</th>
        </tr>
      </thead>
      <tbody>
        {combinedTracks.map((track, index) => (
          <tr key={index}>
            <td>{track.trackName}</td>
            <td>{combinedAlbums.find((album) => album.id === track.onAlbum || album.id === track.onAlbum.id).albumName}</td>   
            <td>{track.availableOn === "spotify" && track.external_urls.spotify}</td>  
            <td>{(track.availableOn === "discogs" && track.onAlbum.videos && track.onAlbum.videos.length > 0) ? <>{track.onAlbum.videos[0].uri}</> : <>no</>}</td>   
          </tr>
        ))}
      </tbody>
    </table>
  );
};
      

    };

export default ResultsTable;
