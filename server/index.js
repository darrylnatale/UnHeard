const express = require('express')
const port = 8888;
const helmet = require("helmet")
const morgan = require("morgan")

const {
  getBowie
} = require("./handlers");



var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId: '0e14701b078b4c3cb5bab549f7cf3c6a',
  clientSecret: '8e0546807dd2423c9b3e2227f1e70355',
  redirectUri: 'http://localhost:8888/callback/'
});

const newToken = () => {
  spotifyApi.clientCredentialsGrant().then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
}

express()
.use(express.json())
.use(helmet())
.use(morgan("tiny"))

.get("/login", (req, res) => newToken())

.get('/getAllAlbums/:artistId', (req, res) => {
  const dataQueried = req.params.artistId
  const albumIds = []
  const trackNames = []


// 1. Get all albums by artist and push their ID to an albumIds array

  spotifyApi.getArtistAlbums(`${dataQueried}`, { limit: 20, offset: 0 })
    .then((data) => {
      const {total, items} = data.body
      
      
      items.forEach((item) => {
        albumIds.push(item.id)
      })

    if (total > 20){
      for (let i = 1; i < Math.ceil(total / 20); i++){
        spotifyApi.getArtistAlbums(`${dataQueried}`, { limit: 20, offset: 20 * i })
        .then((paginatedData) => {
          paginatedData.body.items.forEach((item, index) => {
            albumIds.push(item.id)
          })
        })
      }
    }
    // console.log(albums)

    
    // 2. Using the array of albumIds, get details of all those albums by the artist 
    // and get values
    spotifyApi.getAlbums(albumIds)
    .then((data) => {
      
      const albums = data.body.albums
    
      // 3. Loop through each album and assign the array of track data to a const
    
      albums.forEach((album) => {
        
        const trackFullDetailsOnAlbums = album.tracks.items

        
      // 4. Loop through all the full details and push the names of the tracks to an array
      
      trackFullDetailsOnAlbums.forEach((trackFullDetailOnAlbum) => {
        
        let isByArtistSearched = false
      
        // 5. Check if artist is the right artist 
        const artistsOnTrack = trackFullDetailOnAlbum.artists
        
        artistsOnTrack.forEach((artistOnTrack) => {
          
          if (artistOnTrack.name === "Cicciolina"){
            isByArtistSearched = true
          } 
        })
        // 6. If the correct artist, 

        if (isByArtistSearched){
          trackNames.push(trackFullDetailOnAlbum.name)
         console.log(trackNames)
        }
   
        
        
        
        
      })
      
      })
      
    })
      
    
      
      res.status(200).json({status: 200, message: "Albums Found", data: albums})
      })
    .catch((err) => {
      res.status(400).json({status: 400, message: "Failed", data: err})
    });
  })


  .get('/searchArtist/:artistName', (req, res) => {
    const dataQueried = req.params.artistName
    
    spotifyApi.searchArtists(`${dataQueried}`)
      .then((data) => {
        res.status(200).json({status: 200, message: "Artists Found", data: data})
        })
      .catch((err) => {
        res.status(400).json({status: 400, message: "Failed", data: err})
      });
    })

.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

