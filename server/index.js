const express = require('express')
const port = 8888;
const helmet = require("helmet")
const morgan = require("morgan")
const request = require('request-promise');
const Discogs = require('disconnect').Client;
const SpotifyWebApi = require('spotify-web-api-node');
const { MongoClient, ReturnDocument } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const { access } = require('fs');
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const {
  
} = require("./handlers");






var spotifyApi = new SpotifyWebApi({
  clientId: '0e14701b078b4c3cb5bab549f7cf3c6a',
  clientSecret: '8e0546807dd2423c9b3e2227f1e70355',
  redirectUri: 'http://localhost:8888/callback/'
});

const newSpotifyToken = () => {
  spotifyApi.clientCredentialsGrant().then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
}








// let discogsAccessData = null
// let discogsRequestData = null

let discogsAccessData =  {
  method: 'oauth',
  level: 2,
  consumerKey: 'vlkJsprxTlbVtiVFhVMH',
  consumerSecret: 'wNoIsOLRrkupmLLmlRyZnmstIrulKLey',
  token: 'faFnhztarWJCZVpIrCfqDHROvmqzFgwHDthhULoM',
  tokenSecret: 'EcGrZDSQKaDyzqNnkCutOoieaOrWEHktweNgNyrX'
}

var dis = new Discogs(discogsAccessData);
var db = new Discogs(discogsAccessData).database();



// console.log(discogsRequestData)
console.log(discogsAccessData)

express()
.use(express.json())
.use(helmet())
.use(morgan("tiny"))


.get('/authorize', function(req, res){
	var oAuth = new Discogs().oauth();

	oAuth.getRequestToken(
		'vlkJsprxTlbVtiVFhVMH', 
		'wNoIsOLRrkupmLLmlRyZnmstIrulKLey', 
		'http://localhost:8888/callbackDiscogs/', 

		function(err, requestData){
			// Persist "requestData" here so that the callback handler can 
			discogsRequestData = requestData
      console.log(discogsRequestData)
			res.redirect(requestData.authorizeUrl);      
		}
	);
})

.get('/callbackDiscogs', function(req, res){
	var oAuth = new Discogs(discogsRequestData).oauth();
	oAuth.getAccessToken(
		req.query.oauth_verifier, // Verification code sent back by Discogs
		function(err, accessData){
			discogsAccessData = accessData
      console.log(discogsAccessData)
			res.redirect("http://localhost:8888/identity");
		}
	);
})

.get('/identity', function(req, res){
	var dis = new Discogs(discogsAccessData);

	dis.getIdentity(function(err, data){
		console.log(data)
    res.send(data);
	});

var db = new Discogs(discogsAccessData).database();

db.search("Cicciolina", {type: "artist"}, function(err, data){
  console.log("search", data.results[0])
})
})


.post("/searchDiscogs", async (req, res) => {
  const artistSearched = req.body.formData
  
  try {
    const searchResult = await db.search(artistSearched, {type: "artist"})
    if (searchResult){
      
      res.status(200).json({status: 200, message: "Discogs Content Found", data: searchResult })
    }
  } catch (err) {
    console.log(err)
  }
  

})

.post("/getDiscogsArtistDetails", async (req, res) => {
const receivedDiscogsArtistId = req.body.results

try {
  const artistDetails = await db.getArtist(receivedDiscogsArtistId)

  if (artistDetails){
    res.status(200).json({status: 200, message: "Discogs Content Found", data: artistDetails })
  } else {
    res.status(400).json({status: 400, message: "Discogs Content Found", data: null })
  }

} catch (err) {

}


 

})

.get("/getDiscogsContent", async (req, res) => {

    try {
    
    const discogsAlbums = []
    const discogsAlbumDetails = []
    const discogsVersionIds = []
    const discogsVersions = []
    const discogsMasters = []

    const artistReleases = await db.getArtistReleases(86857)
    
    if (artistReleases){    
      
      artistReleases.releases.forEach((release) => {
        if (release.type === "Master"){
          discogsMasters.push(release)
        }
        if ((release.role === "Main") && (release.type !== "Master")){
          discogsAlbums.push(release)
          console.log(discogsAlbums.length)
        }
      })
      

      for (let i = 0; i < discogsAlbums.length; i++) {
        const getReleases = await db.getRelease(discogsAlbums[i].id)
        if (getReleases){
            getReleases.artists.forEach((artist) => {
              if (artist.id === 86857){
                getReleases.tracklist.forEach((track) => {
                  if (track.artists){
                  track.artists.forEach((artistOnTrack) => {
                    if (artistOnTrack.id === 86857){
                      discogsAlbumDetails.push(getReleases)
                      
                    }
                  })
                  } else {
                    discogsAlbumDetails.push(getReleases)
                  }
                })
                
              } 
            })
        }
        if(discogsAlbums[i].type === "master"){
          const getMasters = await db.getMaster(discogsAlbums[i].id)
            getMasters && discogsAlbumDetails.push(getMasters)
          const getVersionIds = await db.getMasterVersions(discogsAlbums[i].id)
          
          getVersionIds && getVersionIds.versions.forEach((version) => discogsVersionIds.push(version.id))
          
      }
      

      for (let i = 0 ; i < discogsVersionIds.length; i++){
        const getVersionsDetails = await db.getRelease(discogsVersionIds[i])
        getVersionsDetails && discogsVersions.push(getVersionsDetails)
        console.log(getVersionsDetails)
        
      



      }
          
      }
      
      
        
    
      res.status(200).json({status: 200, message: "Discogs Content Found", data: {discogsAlbums: discogsAlbums, discogsAlbumDetails: discogsAlbumDetails, discogsVersions: discogsVersions} })
      }
      else { 
        res.status(400).json({status: 400, message: "Problem Finding Discogs Content" })
      }
    } catch (err) 
    {console.log(err)}
    })


.get("/login", (req, res) => newSpotifyToken())

.post('/getSpotifyContent/:artistId', async (req, res) => {
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
             if (artistOnTrack.name === artistName){
                  isByArtistSearched = true
                } 
                })
            
          isByArtistSearched && tracks.push(trackFullDetailOnAlbum)
                  
        })
      })
      }
        }
      }
      res.status(200).json({status: 200, message: "Spotify Content Found", data: {spotifyArtistName: artistName, spotifyAlbums: albums, spotifyTracks: tracks}})  
    } else { 
      res.status(400).json({status: 400, message: "Error Finding Spotify Content" })
    }
  } catch (err) 
  {
    console.log(err)
  }
  })


  
  

  .get('/searchSpotify/:artistName', (req, res) => {
    const dataQueried = req.params.artistName
    
    spotifyApi.searchArtists(`${dataQueried}`)

      .then((data) => {
        res.status(200).json({status: 200, message: "Artists Found", data: data})
        })
      .catch((err) => {
        res.status(400).json({status: 400, message: "Failed", data: err})
      });
    })

.post("/checkIfInMongo", async (req, res) => {
  
  const discogsArtistIdReceived = JSON.stringify(req.body.discogsArtistId)
  console.log(discogsArtistIdReceived)
  const client = new MongoClient(MONGO_URI, options);
  
  try {

    const mongodb = client.db("UnHeard");
    await client.connect();
    const artistIdMatches = await mongodb.collection("MatchedIds").find().toArray()
    
    let foundMatch = null

    artistIdMatches.forEach((artistIdMatch) => {
      console.log(typeof artistIdMatch.discogsArtistId)
      console.log(typeof discogsArtistIdReceived)
      if (discogsArtistIdReceived === artistIdMatch.discogsArtistId){
        
        foundMatch = {
          spotifyArtistId: artistIdMatch.spotifyArtistId,
          artistName: artistIdMatch.artistName
        }
      }      
    })

    if (foundMatch){
      res.status(200).json({
        status: 200,
        message: ` Hi`,
        data: foundMatch,
      })
    } else {
      res.status(400).json({
        status: 400,
        message: `Not Found`,
        data: null,
  })
}

    
  } catch (err) {
    console.log(err);
  }
  client.close();
})

.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// db.getRelease("1105977", function(err, data){
//   console.log(data)
// })

// db.getArtistReleases("86857", function(err, data){
//   console.log(data.releases.length)
//   console.log(data.releases.forEach((release) => {
//     console.log("releaseid", release)
//   }))
// })

// db.getRelease("702665", function(err, data){
//   console.log(data)
  
// })