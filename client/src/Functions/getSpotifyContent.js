const getSpotifyContent = (spotifyArtistId, artistName) => {
    fetch(`/getSpotifyContent`, {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({spotifyArtistId, artistName}),
        }) 
    .then((res) => res.json())
    .then((data) => {
      console.log("content from spotify", data)

      if (data.data){
            return data.data
            // setAllSpotifyTrackNames(data.data.spotifyTracks.map((spotifyTrack) => spotifyTrack.name))
            // setSpotifyAlbums(data.data.spotifyAlbums)
        }
     })
     .catch((err) => console.log(err));
}

export default getSpotifyContent;