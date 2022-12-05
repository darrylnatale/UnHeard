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
const { post, get } = require('request');
const { type } = require('os');






var spotifyApi = new SpotifyWebApi({
  clientId: '0e14701b078b4c3cb5bab549f7cf3c6a',
  clientSecret: '8e0546807dd2423c9b3e2227f1e70355',
  redirectUri: 'http://localhost:8888/callback/'
});

const newSpotifyToken = () => {
  spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"])
  })
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
      
			res.redirect("http://localhost:8888/identity");
		}
	);
})

.get('/identity', function(req, res){
	var dis = new Discogs(discogsAccessData);

	dis.getIdentity(function(err, data){
		
    res.send(data);
	});

var db = new Discogs(discogsAccessData).database();
})


.post("/searchDiscogs", async (req, res) => {
  const artistSearched = req.body.searchFormData
  
  try {
    const searchResult = await db.search(artistSearched, {type: "artist"})
    if (searchResult){
      
      res.status(200).json({status: 200, message: "Discogs Artist Search Results Found", data: searchResult })
    } else{
      res.status(400).json({status: 400, message: "No Discogs Artist Search Results Found", data: artistSearched })
    }
  } catch (err) {
    res.status(404).json({status: 404, message: "Problem Searching For Discogs Artists", error: err })
  }
  

})

.post("/getDiscogsArtistDetails", async (req, res) => {
const receivedDiscogsArtistId = req.body.results

try {
  const artistDetails = await db.getArtist(receivedDiscogsArtistId)

  if (artistDetails){
    res.status(200).json({status: 200, message: "Discogs Artist Details Found", data: artistDetails })
  } else {
    res.status(400).json({status: 400, message: "Discogs Artist Details Not Found", data: null })
  }

} catch (err) {
  res.status(404).json({status: 404, message: err })
}




})

.post("/addUserToMongo", async (req, res) => {

  const {user} = req.body

  const client = new MongoClient(MONGO_URI, options);

  try {
    const mongodb = client.db("UnHeard");
    await client.connect();
    
    let mongoUsers = await mongodb.collection("Users").find().toArray()

    let foundMatch = false
    
    mongoUsers.forEach((mongoUser) => {
      
      if (user.email === mongoUser.email){
        
        foundMatch = mongoUser
      }      
    })
  
    
    if(!foundMatch){
      let addUser = await mongodb.collection("Users").insertOne(user);
      if (addUser){
        res.status(200).json({status: 200, message: "User Added To Mongo", data: user })
      } 
    } else {
      res.status(400).json({status: 400, message: "User Already In Mongo", data: user })
    }

    

    
  }
  catch (err){
    res.status(404).json({status: 404, message: err })
  }
  client.close();
})

.post("/getLast", async (req, res) => {
  const email = req.body.user.email
  const client = new MongoClient(MONGO_URI, options);
  try {
    const mongodb = client.db("UnHeard");
    await client.connect();
    
    let mongoUsers = await mongodb.collection("Users").find().toArray()

    let foundMatch = false
    
    mongoUsers.forEach((mongoUser) => {
      console.log(email)
      if (email === mongoUser.email){
        
        foundMatch = mongoUser
      }      
    })
  console.log(foundMatch)
  

  
    if(foundMatch){
      const artistDetails = await db.getArtist(foundMatch.artistId)
        res.status(200).json({status: 200, message: "Found Match . Last Search Id was: ", data: artistDetails })
       
    } else {
      res.status(400).json({status: 400, message: "User Not Found", data: null })
    }
    
  }
  catch (err){
    res.status(404).json({status: 404, message: err })
  }
  client.close();
})

.post("/addSearchToUserHistory", async (req, res) => {

  const {discogsArtistId} = req.body
  

  const client = new MongoClient(MONGO_URI, options);

  try {
    const mongodb = client.db("UnHeard");
    await client.connect();
    
    let mongoUsers = await mongodb.collection("Users").updateOne({email: "darrylnatale@gmail.com"}, {$set: {artistId: discogsArtistId }})

    

    
    
    if(mongoUsers){
      res.status(200).json({status: 200, message: "Discogs ID Added to Users History", data: discogsArtistId })
    } else {
      res.status(400).json({status: 400, message: "ID Was Already In To Mongo", data: discogsArtistId })
    }

    

    
  }
  catch (err){
    res.status(404).json({status: 404, message: "didnt work" })
  }
  client.close();
})

.post("/storeMatchedArtistIds", async (req, res) => {

  const {spotifyArtistId, discogsArtistIdState, artistName} = req.body
  const stringifedDiscogsArtistId = JSON.stringify(discogsArtistIdState)
  

  const newEntry = {
    spotifyArtistId: spotifyArtistId,
    discogsArtistId: stringifedDiscogsArtistId,
    artistName: artistName
  }

  const client = new MongoClient(MONGO_URI, options);

  try {
    const mongodb = client.db("UnHeard");
    await client.connect();

    await mongodb.collection("MatchedIds").insertOne(newEntry);

    res.status(200).json({status: 200, message: "Matched Ids Added To Mongo", data: newEntry })
  }
  catch (err){
    res.status(404).json({status: 404, message: err })
  }
  client.close();
})

.post("/storeSingleArtistId", async (req, res) => {


  const {discogsArtistIdState, artistName} = req.body
  
  const stringifedDiscogsArtistId = JSON.stringify(discogsArtistIdState)

  
  

  const newEntry = {
    spotifyArtistId: null,
    discogsArtistId: stringifedDiscogsArtistId,
    artistName: artistName
  }

  const client = new MongoClient(MONGO_URI, options);

  try {
    const mongodb = client.db("UnHeard");
    await client.connect();

    await mongodb.collection("MatchedIds").insertOne(newEntry);

    res.status(200).json({status: 200, message: "Discogs Id Added To Mongo Successfully - No Spotify Match", data: newEntry })
  }
  catch (err){
    res.status(404).json({status: 404, message: err })
  }
  client.close();
})


.post("/getDiscogsContent", async (req, res) => {
  
  let discogsArtistId = req.body.discogsArtistId

  if (typeof req.body.discogsArtistId !== "number"){
    discogsArtistId = Number(req.body.discogsArtistId)
  } 

  
   
  
    try {

      // IDS
      const discogsMasterMainReleaseMainRoleIds = []
      const discogsMasterMainReleaseAppearanceRoleIds = []
      const discogsMasterMainReleaseTrackAppearanceRoleIds = []

      const discogsReleasesMainRoleIds = []
      const discogsReleasesAppearanceRoleIds = []
      const discogsReleasesTrackAppearanceRoleIds = []

      // DETAILS
      const discogsMastersMainReleaseMainRole = []
      const discogsMastersMainReleaseAppearanceRole = []
      const discogsMastersMainReleaseTrackAppearanceRole = []

      const discogsReleasesMainRole = []
      const discogsReleasesAppearanceRole = []
      const discogsReleasesTrackAppearanceRole = []





    
    const discogsAlbumDetails = []
    const discogsVersionIds = []
    const discogsVersions = []

    
    
    const discogsReleaseIds = []

    const artistReleases = await db.getArtistReleases(discogsArtistId)
    
    // IF THERE ARE MORE THAN 50 RESULTS, YOU WILL NEED PAGINATION. FOR NOW YOU LIMIT YOURSELF TO 50.
      // RELEASES ARE EITHER MASTERS OR RELEASES
      // MASTERS HAVE MAIN_RELEASES, RELEASES DO NOT
    if (artistReleases){    
      
      //artistReleases.pagination : {page: 1, pages: 54, per_page: 50, items: 2674, urls: {last: "http://...", next: "http://..."}}
      // console.log("artist releases fetched from api")
      // console.log("there are this many artist releases (masters and releases):", artistReleases.releases.length)
      artistReleases.releases.forEach((release, index) => {
        
// IF TYPE IS MASTER, SEPARATE INTO MAIN & APPEARANCE GET THE MAIN_RELEASE BEFORE FETCHING THE DETAILS
          if (release.type === "master" && release.role === "Main"){
            // console.log("release type:", index, release.type, "main_release id:", release.main_release, "releaseid:", release.id)  
            discogsMasterMainReleaseMainRoleIds.push(release.main_release)
            
          } else if (release.type === "master" && release.role === "Appearance") {
            discogsMasterMainReleaseAppearanceRoleIds.push(release.main_release)
          }  else if (release.type === "master" && release.role === "Track Appearance") {
            //UNSURE IF ROLE : TRACKAPPEARANCE EXISTS FOR MASTERS, check bigger dataset
            discogsMasterMainReleaseTrackAppearanceRoleIds.push(release.main_release)
          }
        
          // GET THE REMAINING RELEASES THAT AREN'T MASTERS  
          if (release.type === "release" && release.role === "Main"){
            discogsReleasesMainRoleIds.push(release.id)
            // console.log("this is a main")
            
          } else if (release.type === "release" && release.role === "Appearance"){
              // console.log("this is an appearance")
            discogsReleasesAppearanceRoleIds.push(release.id)
          } else if (release.type === "release" && release.role === "TrackAppearance"){
            // console.log("this is an trackAppearance")
            discogsReleasesTrackAppearanceRoleIds.push(release.id)
          } 
            
            
          
      })
      // console.log(discogsMasterMainReleaseMainRoleIds.length)
      // console.log(discogsMasterMainReleaseAppearanceRoleIds.length)
      // console.log(discogsMasterMainReleaseTrackAppearanceRoleIds.length)


      // console.log(discogsReleasesMainRoleIds.length)
      // console.log(discogsReleasesAppearanceRoleIds.length)
      // console.log(discogsReleasesTrackAppearanceRoleIds.length)
     
      // don't change the i to be more than the length of the releases or it will break (eg 5 releases, 10 "i's is BAD)
      
      // GET THE MASTER MAIN RELEASES WITH ROLE: MAIN 
      
      for (let i = 0; i < discogsMasterMainReleaseMainRoleIds.length; i++) {
        
        const getMasters = await db.getRelease(discogsMasterMainReleaseMainRoleIds[i])
        if (getMasters){
          
            getMasters.artists.forEach((artist) => {
              
              if (artist.id === discogsArtistId){
                discogsMastersMainReleaseMainRole.push(getMasters) 
                
                // getMasters.tracklist.forEach((track) => {
                //   if (track.artists){
                //   track.artists.forEach((artistOnTrack) => {
                //     if (artistOnTrack.id === discogsArtistId){
                //       console.log("executed if")
                       
                //     }
                //   })
                //   } 
                // })
              } 
            })
        }

        // TODO: GET THE OTHER VERSIONS WITH ROLE: MAIN (VERSIONS LINK INSIDE ITEMS discogsMastersMainReleaseMainRole ARRAY)
        
     
          
      }

      // TO DO: GET THE MASTER MAIN RELEASES WITH ROLE: APPEARANCE 
            // THESE PROBABLY ONLY HAVE VOCALS OR WHATEVER
      for (let i = 0; i < discogsMasterMainReleaseAppearanceRoleIds.length; i++) {
        const getMasters = await db.getRelease(discogsMasterMainReleaseAppearanceRoleIds[i])
        if (getMasters){
        }
      }
          //AND POSSIBLY VERSIONS OF THESE
      
      // TO DO: GET THE MASTER MAIN RELEASES WITH ROLE: TRACK APPEARANCE (IF IT EXISTS) 
            // THESE PROBABLY ONLY HAVE VOCALS OR WHATEVER
        
        
          //GET RELEASES WITH ROLE: MAIN    
        for (let i = 0; i < discogsReleasesMainRoleIds.length; i++) {
          const getReleases = await db.getRelease(discogsReleasesMainRoleIds[i])
          if (getReleases){

            getReleases.artists.forEach((artist) => {
              if (artist.id === discogsArtistId){
                discogsReleasesMainRole.push(getReleases) 
              }
            })
          }
        }
        // TO DO: GET RELEASES WITH ROLE: APPEARANCE (IF IT EXISTS) 
        
        //GET RELEASES WITH ROLE: TRACK APPEARANCE 
        
        for (let i = 0; i < discogsReleasesTrackAppearanceRoleIds.length; i++) {
          const getReleases = await db.getRelease(discogsReleasesTrackAppearanceRoleIds[i])
          
          if (getReleases){
            let containsArtist = false
            
            getReleases.tracklist.forEach((tracklist) => {
              
              if (tracklist.artists){
                
                tracklist.artists.forEach((artist) => {
                  if (artist.id === discogsArtistId){
                    containsArtist = true
                  }
                })
              } 
              
            })
            if (containsArtist === true){
              discogsReleasesTrackAppearanceRole.push(getReleases)
            }
          }
        }

        const discogsContent = {
          masters: {
            mainReleases: {
              roles: {
                main: discogsMastersMainReleaseMainRole,
                appearance: discogsMastersMainReleaseAppearanceRole,
                trackAppearance: discogsMastersMainReleaseTrackAppearanceRole 
              }
            },
            versions: null,
          },
          releases: {
              roles: {
                main: discogsReleasesMainRole,
                appearance: discogsReleasesAppearanceRole,
                trackAppearance: discogsReleasesTrackAppearanceRole
              }
          }
        }
        // console.log(discogsContent.masters.mainReleases)
      res.status(200).json({status: 200, message: "Discogs Content Found", data: discogsContent })
      }
      else { 
        res.status(400).json({status: 400, message: "Problem Finding Discogs Content" })
      }
    } catch (err) 
    {res.status(404).json({status: 404, message: err })}
    })


.get("/loginToSpotify", (req, res) => newSpotifyToken())

.post('/getSpotifyContent', async (req, res) => {
  const {spotifyArtistId, artistName} = req.body
  // !! IF SPOTIFYARTISTID IS NULL , MEANS THE ARTIST DOES NOT EXIST ON SPOTIFY - INCLUDE LOGIC

  try {
    const tracks = []
    const albums = []
    const albumIds = []
    const firstPageAlbumResults = await spotifyApi.getArtistAlbums(spotifyArtistId, { limit: 20, offset: 0 })
    
    if (firstPageAlbumResults){
      const {total, items} = firstPageAlbumResults.body
      items.forEach((item) => {
        albums.push(item)
        albumIds.push(item.id)
      })
      
      if (total > 20){
          for (let i = 1; i < Math.ceil(total / 20); i++){
            const additionalResults = await spotifyApi.getArtistAlbums(`${spotifyArtistId}`, { limit: 20, offset: 20 * i })
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
      console.log("mybad")
      res.status(400).json({status: 400, message: "Error Finding Spotify Content" })
    }
  } catch (err) 
  {
    console.log(err)
    res.status(404).json({status: 404, message: err })
  }
  })


  
  

  .get('/searchSpotify/:artistName', (req, res) => {
    const dataQueried = req.params.artistName
    
    spotifyApi.searchArtists(`${dataQueried}`)

      .then((data) => {
        // console.log(data)
        res.status(200).json({status: 200, message: "Artists Found", data: data})
        })
      .catch((err) => {
        console.log(err)
        res.status(404).json({status: 404, message: "Failed", data: err})
      });
    })

.post("/checkIfInMongo", async (req, res) => {
  
  const discogsArtistIdReceived = JSON.stringify(req.body.discogsArtistId)
  
  const client = new MongoClient(MONGO_URI, options);
  
  try {

    const mongodb = client.db("UnHeard");
    await client.connect();
    const artistIdMatches = await mongodb.collection("MatchedIds").find().toArray()
    
    let foundMatch = null

    artistIdMatches.forEach((artistIdMatch) => {
      
      if (discogsArtistIdReceived === artistIdMatch.discogsArtistId){
        
        foundMatch = {
          spotifyArtistId: artistIdMatch.spotifyArtistId,
          artistName: artistIdMatch.artistName,
          discogsArtistId: artistIdMatch.discogsArtistId,
        }
      }      
    })

    if (foundMatch){
      res.status(200).json({
        status: 200,
        message: `Successfully checked Mongo - Record Exists!`,
        data: foundMatch,
      })
    } else {
      res.status(200).json({
        status: 200,
        message: `Successfully checked Mongo - Record Does NOT Exist - Proceed To Verify  `,
        data: null,
  })
}

    
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: `Problem Checking Mongo!`,
      data: null,
})
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