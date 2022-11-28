const express = require('express')
const port = 8888;
const helmet = require("helmet")
const morgan = require("morgan")
const request = require('request-promise');

var Discogs = require('disconnect').Client;

const {
  getBowie
} = require("./handlers");




// db.search("Cicciolina", function(err, data){
//     console.log(data)
//   console.log(err)})


  
  
    
  
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



let userToken = null



var dis = new Discogs('MyUserAgent/1.0');
var db = new Discogs().database();




// db.getRelease("1105977", function(err, data){
//   console.log(data)
// })


var SpotifyWebApi = require('spotify-web-api-node');
const { access } = require('fs');

var spotifyApi = new SpotifyWebApi({
  clientId: '0e14701b078b4c3cb5bab549f7cf3c6a',
  clientSecret: '8e0546807dd2423c9b3e2227f1e70355',
  redirectUri: 'http://localhost:8888/callback/'
});

const newSpotifyToken = () => {
  spotifyApi.clientCredentialsGrant().then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
}

const newDiscogsToken = (req, res) => {
  
    var oAuth = new Discogs().oauth();

    oAuth.getRequestToken(
      'vlkJsprxTlbVtiVFhVMH', 
      'wNoIsOLRrkupmLLmlRyZnmstIrulKLey', 
      'http://localhost:8888/callback2/', 
      function(err, requestData){
        // Persist "requestData" here so that the callback handler can 
        // access it later after returning from the authorize url
        // res.redirect(requestData.authorizeUrl);
        console.log(requestData)
        
        
      }
    )
}
   
  
  

    
express()
.use(express.json())
.use(helmet())
.use(morgan("tiny"))


.get('/authorize', (req, res) => newDiscogsToken())

.get("/getDiscogsContent", async (req, res) => {
  
  // try {
  //   const discogsAlbums = []
  //   const discogsTracks = []

  //   const artistReleases = await db.getArtistReleases(605776)
    
  //   if (artistReleases){
  //     discogsAlbums.push(artistReleases.releases)
    
  //   // if (discogsAlbums[0].length > 0){
  //   //   for(let i = 0; i < discogsAlbums[0].length; i++){
  //   //     const getReleases = await db.getRelease(discogsAlbums[0][i].id)
  //   //       if (getReleases){
  //   //         discogsTracks.push(getReleases)
  //   //       }
  //   //     } 
  //   // }

   
  // } res.status(200).json({status: 200, message: " Found", data: 4})  
  // {

  // }
  
  
  //   } catch (err) {
  //   console.log(err)
  //   }

    try {
      

          const discogsAlbums = []
    const discogsTracks = []

    const artistReleases = await db.getArtistReleases(605776)
    
    if (artistReleases){
      discogsAlbums.push(artistReleases.releases)

        
    //   for(let i = 0; i < discogsAlbums[0].length; i++){
    //     const getReleases = await db.getRelease(discogsAlbums[0][i].id)
    //       if (getReleases){
    //         discogsTracks.push(getReleases)
    //       }
    //     } 
    // 

    
      res.status(200).json({status: 200, message: "Discogs Data Found", data: discogsAlbums })
    }
      else { 
        res.status(400).json({status: 400, message: "Not Found" })
      }
    } catch (err) 
    {console.log(err)}
    

    })

 
      

.get("/login", (req, res) => newSpotifyToken())

.post('/getAllAlbums/:artistId', async (req, res) => {
  const {artistId, artistName} = req.body
  

  try {
    const tracks = []
    const albums = []
    const albumIds = []
    const firstPageAlbumResults = await spotifyApi.getArtistAlbums(`${artistId}`, { limit: 20, offset: 0 })
    
    if (firstPageAlbumResults){
      const {total, items} = firstPageAlbumResults.body
      items.forEach((item) => {
        albums.push(item)
        albumIds.push(item.id)
      })
      
      if (total > 20){
          for (let i = 1; i < Math.ceil(total / 20); i++){
            const additionalResults = await spotifyApi.getArtistAlbums(`${artistId}`, { limit: 20, offset: 20 * i })
            if (additionalResults){
              const {items} = additionalResults.body
              items.forEach((item) => {
                albums.push(item)
                albumIds.push(item.id)
              }) 
            }
          }
      }
      
      const totalAlbumsFound = albumIds.length
      
      if (totalAlbumsFound){
        for (let i = 0; i < Math.ceil(totalAlbumsFound / 20); i++){
          const albumDetails = await spotifyApi.getAlbums(albumIds.slice(20 * i, (i+1) * 20))
          if (albumDetails){
        const {albums} = albumDetails.body
        
        albums.forEach((album) => {  
        const trackFullDetailsOnAlbums = album.tracks.items
        
        trackFullDetailsOnAlbums.forEach((trackFullDetailOnAlbum) => {
          let isByArtistSearched = false
          const artistsOnTrack = trackFullDetailOnAlbum.artists 
          
          artistsOnTrack.forEach((artistOnTrack) => { 
             if (artistOnTrack.name === artistName){isByArtistSearched = true} 
          })
            if (isByArtistSearched){tracks.push(trackFullDetailOnAlbum)}
    
        })
      })
      }
        }
      }
      res.status(200).json({status: 200, message: "Tracks Found", data: {spotifyArtistName: artistName, spotifyAlbums: albums, spotifyTracks: tracks}})  
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

