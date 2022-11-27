const express = require('express')
const port = 8888;
const helmet = require("helmet")
const morgan = require("morgan")
const request = require('request-promise');

var Discogs = require('disconnect').Client;

const {
  getBowie
} = require("./handlers");


// var db = new Discogs().database();
// // db.getArtist(605776, function(err, data){
// //   console.log(data)
// // })

// // db.getArtistReleases(47843, function(err, data){
  
// // data.releases.forEach((release) => {
// //   console.log(release.id)
// // })
    
      
// //     })
  
// const albumIds = [1391846,
//   1524799,
//   1400493,
//   120588,
//   130064,
//   300512,
//   151167,
//   806242,
//   1552533,
//   12687120,
//   5485057,
//   12686958,
//   12686990,
//   2597180,
//   2599059,
//   10996649,
//   665767,
//   1269646,
//   2584691,
//   2786626,
//   1626262,
//   2991460,
//   1283793,
//   1772418,
//   2520044,
//   3541606,
//   502497,
//   273725,
//   554167,
//   10481381,
//   7491406,
//   10480291,
//   10428310,
//   1692119,
//   6893591,
//   273725]

//   for(let i = 0; i < 10; i++){
//     db.getRelease(albumIds[i], function(err, data){
//         console.log(data.title)
//   })
// }
  
  
    
    


// //       data.tracklist.forEach((tracklistItem) => {
// //         tracklistItem.artists.forEach((artist) => {
// //           if (artist.name === "Cicciolina"){
// //             console.log(tracklistItem.title)
// //           }
// //         })
// //       });
// //     });
    
// //   })
// // })







// var dis = new Discogs('MyUserAgent/1.0');

/// SPOTIFY

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

.post('/getAllAlbums/:artistId', async (req, res) => {
  const {artistId, artistName} = req.body
  

  try {
    const trackNames = []
    const albumIds = []
    const firstPageAlbumResults = await spotifyApi.getArtistAlbums(`${artistId}`, { limit: 20, offset: 0 })
    
    if (firstPageAlbumResults){
      const {total, items} = firstPageAlbumResults.body
      items.forEach((item) => {
      albumIds.push(item.id)
      })
      
      if (total > 20){
          for (let i = 1; i < Math.ceil(total / 20); i++){
            const additionalResults = await spotifyApi.getArtistAlbums(`${artistId}`, { limit: 20, offset: 20 * i })
            if (additionalResults){
              const {items} = additionalResults.body
              items.forEach((item) => {
              albumIds.push(item.id)
              }) 
            }
          }
      }
      
      const totalAlbumsFound = albumIds.length
      
      if (totalAlbumsFound > 20){
        for (let i = 0; i < Math.ceil(totalAlbumsFound / 20); i++){
          const albumDetails = await spotifyApi.getAlbums(albumIds.slice(20 * i, (i+1) * 20))
          if (albumDetails){
        const {albums} = albumDetails.body
        console.log(albumDetails.body)
        
        albums.forEach((album) => {  
        const trackFullDetailsOnAlbums = album.tracks.items
        
        trackFullDetailsOnAlbums.forEach((trackFullDetailOnAlbum) => {
          let isByArtistSearched = false
          const artistsOnTrack = trackFullDetailOnAlbum.artists 
          
          artistsOnTrack.forEach((artistOnTrack) => { 
             if (artistOnTrack.name === artistName){isByArtistSearched = true} 
          })
            if (isByArtistSearched){trackNames.push(trackFullDetailOnAlbum.name)}
    
        })
      })
      }
        }

      }

      // const albumDetails = await spotifyApi.getAlbums(albumIds)
      
      // if (albumDetails){
      //   const {albums} = albumDetails.body
      //   console.log(albumDetails.body)
        
      //   albums.forEach((album) => {  
      //   const trackFullDetailsOnAlbums = album.tracks.items
        
      //   trackFullDetailsOnAlbums.forEach((trackFullDetailOnAlbum) => {
      //     let isByArtistSearched = false
      //     const artistsOnTrack = trackFullDetailOnAlbum.artists 
          
      //     artistsOnTrack.forEach((artistOnTrack) => { 
      //        if (artistOnTrack.name === artistName){isByArtistSearched = true} 
      //     })
      //       if (isByArtistSearched){trackNames.push(trackFullDetailOnAlbum.name)}
    
      //   })
      // })
      // }
      res.status(200).json({status: 200, message: "Tracks Found", data: trackNames})  
    } else {
      
      res.status(400).json({status: 400, message: "Tracks Not Found" })
    }
  } catch (err) 
  {
    console.log(err)
  }

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

