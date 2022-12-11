import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";

const ResultsTable = () => {

    const {allData, setAllData, releases} = useContext(Context)
    console.log("alldata",allData)
    console.log("releases",releases)

    const combinedAlbums = [].concat(...allData.albums);

      
    //   setAllData(prevState => ({
    //     ...prevState,
    //     albums: combinedAlbums
    //   }))


    
    const sortAlphabetically = (ascending) => {
        // Create a compare function for sorting the albums array
        const compareAlbumNames = (album1, album2) => {
          if (ascending) {
            // Sort in ascending order
            if (album1.albumName < album2.albumName) {
              return -1;
            } else if (album1.albumName > album2.albumName) {
              return 1;
            } else {
              return 0;
            }
          } else {
            // Sort in descending order
            if (album1.albumName > album2.albumName) {
              return -1;
            } else if (album1.albumName < album2.albumName) {
              return 1;
            } else {
              return 0;
            }
          }
        };
      
        // Create a compare function for sorting the tracks array
        const compareTrackNames = (track1, track2) => {
          if (ascending) {
            // Sort in ascending order
            if (track1.trackName < track2.trackName) {
              return -1;
            } else if (track1.trackName > track2.trackName) {
              return 1;
            } else {
              return 0;
            }
          } else {
            // Sort in descending order
            if (track1.trackName > track2.trackName) {
              return -1;
            } else if (track1.trackName < track2.trackName) {
              return 1;
            } else {
              return 0;
            }
          }
        };
      
        // Create a new array of albums with sorted tracks
        const sortedAlbums = allData.albums
          .sort(compareAlbumNames) // Sort the albums array
          .map((album) => {
            // Sort the tracks alphabetically and return the album with the sorted tracks
            return { ...album, tracks: album.tracks.sort(compareTrackNames) };
          });
      
        // Update allData with the new sortedAlbums array
        setAllData({ ...allData, albums: sortedAlbums });
      };
    
      
  if (allData.albums && allData.artistName){
  return (
    <table>
      <thead>
        <tr>
          <th>Tracks</th>
          <th>Appears On</th>
        </tr>
      </thead>
      <tbody>
        {allData.tracks.map((track, index) => (
          <tr key={index}>
            <td>{track.trackName}</td>
            <td>{combinedAlbums.find((album) => album.id === track.onAlbum).albumName}</td>   
          </tr>
        ))}
        {combinedAlbums.map((album, index) => (
          <tr key={index}>
            <td>{album.title && <>songs to go here</>}</td>
            <td>{album.title && album.title}</td>   
          </tr>
        ))}
      </tbody>
    </table>
  );
};
      

    };

export default ResultsTable;
