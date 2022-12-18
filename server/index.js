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
    
    let mongoUsers = await mongodb.collection("Users").updateOne({email: "darrylnatale@gmail.com"}, { $push: { artistIds: discogsArtistId } })

    

    
    
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

.post("/getArtistReleases", async (req, res) => {
  console.log(req.body)
  let discogsArtistId = req.body.discogsArtistId
  
  let page = req.body.page

  if (!page){
    console.log("no page", )
    page = 1
  }  else {
    console.log("current page", page)
  }
  
  if (typeof req.body.discogsArtistId !== "number"){
    discogsArtistId = Number(req.body.discogsArtistId)
  } 

  
  try {
    const artistReleases = await db.getArtistReleases(discogsArtistId, {page: page, per_page: 100})    
    if(artistReleases){
        console.log(artistReleases.pagination)
        res.status(200).json({status: 200, message: "artist releases", data: artistReleases })
    } else {
        res.status(400).json({status: 400, message: "not found", data: null })
    }
  }
  catch (err){
    res.status(404).json({status: 404, message: "problem with api", data: err })
  }
  
})

.post("/getTrackAppearances", async (req, res) => {
  
  console.log(req.body)
  
  let {discogsReleasesTrackAppearanceRoleIds} = req.body
  
    try {
      let discogsReleasesTrackAppearanceRole = []

      for (let i = 0; i < discogsReleasesTrackAppearanceRoleIds.length; i++) {
        const getTrackAppearances = await db.getRelease(discogsReleasesTrackAppearanceRoleIds[i])
        
        if (getTrackAppearances){
          let containsArtist = false
          
          getTrackAppearances.tracklist.forEach((tracklist) => {
            
            if (tracklist.artists){
              
              tracklist.artists.forEach((artist) => {
                if (artist.id === discogsArtistId){
                  containsArtist = true
                }
              })
            } 
            
          })
          if (containsArtist === true){
            discogsReleasesTrackAppearanceRole.push(getTrackAppearances)
          }
        }
      }
        
    
      
      if(discogsReleasesTrackAppearanceRole[0]){
        res.status(200).json({status: 200, message: "Track Appearances Found:", data: discogsReleasesTrackAppearanceRole })
      } 
      else {
          res.status(400).json({status: 400, message: "No Track Appearances Found", data: null })
      }
    }
    catch (err){
      res.status(404).json({status: 404, message: "Problem with api", data: err })
    }
  
})

.post("/getDiscogsMasters", async (req, res) => {
    

    let discogsArtistId = Number(req.body.discogsArtistId)    
    let albumId = Number(req.body.albumId)
    let albumOverview = req.body.albumOverview
      
    try {
        
      let master = null
      const versions = []
      let versionsPagination = null

      if (discogsArtistId){ 

        const getMasterReleaseDetails = await db.getRelease(albumId)
          
          master = getMasterReleaseDetails
          
          
        const getVersions = await db.getMasterVersions(master.master_id)
            
              versionsPagination = getVersions.pagination
              getVersions.versions.forEach((version) => {
                if (version.id !== albumId)
                versions.push(version)
              })
            
         
          
        
          // THIS SECTION WORKS - YOU NEED TO MOVE IT TO ANOTHER FUNCTION AND SLOW IT DOWN OR IT WILL CAUSE A 429 
        
      //   for (let i = 0; i < versionIds.length; i++) {
          
      //     if (versionIds[i] !== albumId){
      //     const getVersionDetails = await db.getRelease(versionIds[i])
      //     getVersionDetails && getVersionDetails.artists.forEach((artist) => {
      //       if (artist.id === discogsArtistId){
      //         versions.push(getVersionDetails)
      //       }
      //     })
      //   }
      // }
        
      const renamedMaster = Object.assign({}, master, {albumName: master.title})
                  renamedMaster.availableOn = "discogs"
                  renamedMaster.otherVersions = {versionsPagination: versionsPagination, versions: versions}
                  renamedMaster.artistName = master.artists_sort
                  renamedMaster.albumOverview = albumOverview
                  delete renamedMaster.title
                  delete renamedMaster.status
                  delete renamedMaster.stats
                  delete renamedMaster.blocked_from_sale
                  delete renamedMaster.community
                  delete renamedMaster.companies
                  delete renamedMaster.date_changed
                  delete renamedMaster.estimated_weight
                  delete renamedMaster.format_quantity
                  delete renamedMaster.lowest_price
                  delete renamedMaster.num_for_sale
                  delete renamedMaster.series

        master = renamedMaster

        const discogsMasters = {
          master: master,
          otherVersions: {versionsPagination: versionsPagination, versions: versions},
        }
        
        
      res.status(200).json({status: 200, message: "Discogs Master Found", data: discogsMasters })
      }
      else { 
        res.status(400).json({status: 400, message: "Problem Finding Master Content" })
      }
    } catch (err) 
    {res.status(404).json({status: 404, message: err })}
})

.post("/getDiscogsContent", async (req, res) => {
    console.log("reqbody",req.body)
    let discogsArtistId = req.body.discogsArtistId
    let albumId = req.body.albumId
    console.log("albumId", albumId)
    // let page = req.body.page

    // if (!page){
    //   console.log("no page", )
    //   page = 1
    // }  else {
    //   console.log("current page", page)
    // }
    
    if (typeof req.body.discogsArtistId !== "number"){
      discogsArtistId = Number(req.body.discogsArtistId)
    } 

    
    
    
      try {
        
        const masterIds = []
        const versionIds =[]
        const masters = []
        const versions =[]
        // const discogsReleasesMainRoleIds = []
        // const discogsReleasesAppearanceRoleIds = []
        // const discogsReleasesTrackAppearanceRoleIds = []
        // const discogsReleasesUnofficialReleaseRoleIds = []

        // // DETAILS
        // const discogsMastersMainReleaseMainRole = [] // DONE
        //   const discogsMastersMainReleaseMainRole_Versions = [] // DONE
        // const discogsMastersMainReleaseAppearanceRole = []
        // const discogsMastersMainReleaseTrackAppearanceRole = []

        // const discogsReleasesMainRole = [] // DONE
        // const discogsReleasesAppearanceRole = [] // DONE
        // const discogsReleasesTrackAppearanceRole = [] // DONE



      // const artistReleases = await db.getArtistReleases(discogsArtistId, 
      //   // {page: page, per_page: 100}
      //   )
      
      if (discogsArtistId){    
        
        // paginationDetails = artistReleases.pagination
        
  //       artistReleases.releases.forEach((release, index) => {
          
  // // IF TYPE IS MASTER, SEPARATE INTO MAIN & APPEARANCE GET THE MAIN_RELEASE BEFORE FETCHING THE DETAILS
  //           if (release.type === "master" && release.role === "Main"){
  //             // console.log("release type:", index, release.type, "main_release id:", release.main_release, "releaseid:", release.id)  
  //             discogsMasterMainReleaseMainRoleIds.push(release.main_release)    
  //           } else if (release.type === "master" && release.role === "Appearance") {
  //             discogsMasterMainReleaseAppearanceRoleIds.push(release.main_release)
  //           } else if (release.type === "master" && release.role === "Track Appearance") {
  //             //UNSURE IF ROLE : TRACKAPPEARANCE EXISTS FOR MASTERS, check bigger dataset
  //             discogsMasterMainReleaseTrackAppearanceRoleIds.push(release.main_release)
  //           }
          
  //           // SEPARATE THE REMAINING RELEASES THAT AREN'T MASTERS  
  //           if (release.type === "release" && release.role === "Main"){
  //             discogsReleasesMainRoleIds.push(release.id)
  //             // console.log("this is a main")
              
  //           } else if (release.type === "release" && release.role === "Appearance"){
  //               // console.log("this is an appearance")
  //             discogsReleasesAppearanceRoleIds.push(release.id)
  //           } else if (release.type === "release" && release.role === "TrackAppearance"){
  //             // console.log("this is an trackAppearance")
  //             discogsReleasesTrackAppearanceRoleIds.push(release.id)
  //           } 
              
              
            
  //       })
        
        
        // GET THE MASTER MAIN RELEASES WITH ROLE: MAIN 
        // console.log(discogsMasterMainReleaseMainRoleIds.length)

        
          
          const getMasterReleaseDetails = await db.getRelease(albumId)
          if (getMasterReleaseDetails){
            console.log(getMasterReleaseDetails)
              getMasterReleaseDetails.artists.forEach((artist) => {
                  console.log(getMasterReleaseDetails.master_id)

                if (artist.id === discogsArtistId){
                  masters.push(getMasterReleaseDetails) 
                  console.log(getMasterReleaseDetails.master_id)
                  versionIds.push(getMasterReleaseDetails.master_id)
                } 
              })
          }
          // console.log(discogsMastersMainReleaseMainRole_VersionIds.length)
          for (let i = 0; i < versionIds.length; i++){
            const getVersions = await db.getMasterVersions(versionId)
            if(getVersions){
              getVersions.versions.forEach((version) => {
                versionIds.push(version.id)
              })
            }  
          }
          
        
        
        console.log("versions",versionIds.length)
        for (let i = 0; i < versionIds.length; i++) {
          
          
          const getVersionDetails = await db.getRelease(versionIds[i])
          getVersionDetails && getVersionDetails.artists.forEach((artist) => {
            if (artist.id === discogsArtistId){
              versions.push(getVersionDetails)
            }
          })
        }
        
          
          
            //GET RELEASES WITH ROLE: MAIN    
          // for (let i = 0; i < discogsReleasesMainRoleIds.length; i++) {
          //   const getReleases = await db.getRelease(discogsReleasesMainRoleIds[i])
          //   if (getReleases){

          //     getReleases.artists.forEach((artist) => {
          //       if (artist.id === discogsArtistId){
          //         discogsReleasesMainRole.push(getReleases) 
          //       }
          //     })
          //   }
          // }
          // TO DO: GET RELEASES WITH ROLE: APPEARANCE (IF IT EXISTS) 
          
          
          

          const discogsContent = {
            masters: {
              mainReleases: {
                roles: {
                  main: masters,
                  appearance: masters,
                  trackAppearance: versions,
                  trackAppearanceIds: versions 
                }
              },
              versions: versions,
            },
          }
          console.log(discogsContent)
        res.status(200).json({status: 200, message: "Discogs Content Found", data: discogsContent })
        }
        else { 
          res.status(400).json({status: 400, message: "Problem Finding Discogs Content" })
        }
      } catch (err) 
      {res.status(404).json({status: 404, message: err })}
      })

.post("/getDiscogsReleases", async (req, res) => {
  
  console.log("getDiscogsReleases run")
  let albumOverview = req.body.albumOverview
  let role = req.body.albumOverview.role
  let discogsArtistId = Number(req.body.discogsArtistId)
  let albumId = Number(req.body.albumId)
  
console.log(role, discogsArtistId, albumId)
  

  try {
    let release = null
    if (discogsArtistId){ 

      const getReleaseDetails = await db.getRelease(albumId)
        console.log(role)
        if (getReleaseDetails && role === "Main"){
          
          release = Object.assign({}, getReleaseDetails, {albumName: getReleaseDetails.title})
                release.availableOn = "discogs"
                release.artistName = getReleaseDetails.artists_sort
                release.role = "Main"
                release.albumOverview = albumOverview
                delete release.title
                delete release.status
                delete release.stats
                delete release.blocked_from_sale
                delete release.community
                delete release.companies
                delete release.date_changed
                delete release.estimated_weight
                delete release.format_quantity
                delete release.lowest_price
                delete release.num_for_sale
                delete release.series
          
        } else if (getReleaseDetails && role === "Appearance"){
          release = Object.assign({}, getReleaseDetails, {albumName: getReleaseDetails.title})
              release.availableOn = "discogs"
              release.role = "Appearance"
              release.artistName = getReleaseDetails.artists_sort
              release.albumOverview = albumOverview
              delete release.title
              delete release.status
              delete release.stats
              delete release.blocked_from_sale
              delete release.community
              delete release.companies
              delete release.date_changed
              delete release.estimated_weight
              delete release.format_quantity
              delete release.lowest_price
              delete release.num_for_sale
              delete release.series
              delete release.data_quality
              delete release.identifiers

              
              
        } else if (getReleaseDetails && role === "TrackAppearance"){
              
          release = Object.assign({}, getReleaseDetails, {albumName: getReleaseDetails.title})
              release.availableOn = "discogs"
              release.role = "TrackAppearance"
              release.artistName = getReleaseDetails.artists_sort
              release.albumOverview = albumOverview
              delete release.title
              delete release.status
              delete release.stats
              delete release.blocked_from_sale
              delete release.community
              delete release.companies
              delete release.date_changed
              delete release.estimated_weight
              delete release.format_quantity
              delete release.lowest_price
              delete release.num_for_sale
              delete release.series
              delete release.data_quality
              delete release.identifiers
        } else if (getReleaseDetails && role === "UnofficialRelease"){
          release = Object.assign({}, getReleaseDetails, {albumName: getReleaseDetails.title})
          release.availableOn = "discogs"
          release.role = "UnofficialRelease"
          release.artistName = getReleaseDetails.artists_sort
          release.albumOverview = albumOverview
          delete release.title
          delete release.status
          delete release.stats
          delete release.blocked_from_sale
          delete release.community
          delete release.companies
          delete release.date_changed
          delete release.estimated_weight
          delete release.format_quantity
          delete release.lowest_price
          delete release.num_for_sale
          delete release.series
          delete release.data_quality
          delete release.identifiers
        } else if (getReleaseDetails && role === "Producer"){
          release = Object.assign({}, getReleaseDetails, {albumName: getReleaseDetails.title})
          release.availableOn = "discogs"
          release.role = "Producer"
          release.artistName = getReleaseDetails.artists_sort
          release.albumOverview = albumOverview
          delete release.title
          delete release.status
          delete release.stats
          delete release.blocked_from_sale
          delete release.community
          delete release.companies
          delete release.date_changed
          delete release.estimated_weight
          delete release.format_quantity
          delete release.lowest_price
          delete release.num_for_sale
          delete release.series
          delete release.data_quality
          delete release.identifiers
        }
        
      
      
      
    res.status(200).json({status: 200, message: "Discogs Releases Found", data: release })
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
    const albumIds = []
    
    const tracks = []
    const albums = []
    
    const firstPageAlbumResults = await spotifyApi.getArtistAlbums(spotifyArtistId, { limit: 20, offset: 0 })
    
    if (firstPageAlbumResults){
      const {total, items} = firstPageAlbumResults.body
      items.forEach((item, index) => {
        const renamedItem = Object.assign({}, item, {
          albumName: item.name,
        });

        renamedItem.availableOn = "spotify"
        delete renamedItem.available_markets
        delete renamedItem.name
        albums.push(renamedItem)
        albumIds.push(renamedItem.id)
      })
      
      if (total > 20){
          for (let i = 1; i < Math.ceil(total / 20); i++){
            const additionalResults = await spotifyApi.getArtistAlbums(`${spotifyArtistId}`, { limit: 20, offset: 20 * i })
            if (additionalResults){
              const {items} = additionalResults.body
              items.forEach((item) => {
                const renamedItem = Object.assign({}, item, {
                  albumName: item.name,
                });
                renamedItem.availableOn = "spotify"
                delete renamedItem.available_markets
                delete renamedItem.name
                albums.push(renamedItem)
                albumIds.push(renamedItem.id)
              }) 
            }
          }
      }
      
      // Get the track details for each album
const totalAlbumsFound = albumIds.length

if (totalAlbumsFound) {
  for (let i = 0; i < Math.ceil(totalAlbumsFound / 20); i++) {
    const albumDetails = await spotifyApi.getAlbums(albumIds.slice(20 * i, (i+1) * 20))
    const {albums: albumTracks} = albumDetails.body

    // Add the tracks by the artist to the tracks array
    albumTracks.forEach((album) => {  
      const trackFullDetailsOnAlbums = album.tracks.items
      const albumTracks = []
      trackFullDetailsOnAlbums.forEach((trackFullDetailOnAlbum) => {
        let isByArtistSearched = false
        const artistsOnTrack = trackFullDetailOnAlbum.artists

        artistsOnTrack.forEach((artistOnTrack) => { 
          if (artistOnTrack.name === artistName) {
            isByArtistSearched = true
          } 
        })
        
        

        const renamedTrackFullDetailOnAlbum = Object.assign({}, trackFullDetailOnAlbum, {
          trackName: trackFullDetailOnAlbum.name,
        });
        renamedTrackFullDetailOnAlbum.availableOn = "spotify"
        renamedTrackFullDetailOnAlbum.onAlbum = album.id
        delete renamedTrackFullDetailOnAlbum.available_markets
        delete renamedTrackFullDetailOnAlbum.is_local
        delete renamedTrackFullDetailOnAlbum.explicit
        delete renamedTrackFullDetailOnAlbum.name

        

        
        isByArtistSearched && tracks.push(renamedTrackFullDetailOnAlbum)
        isByArtistSearched && albumTracks.push(renamedTrackFullDetailOnAlbum)

      })

      // Find the matching album in the albums array and add the tracks array as a new key-value pair
      albums.forEach((albumInArray) => {
        if (albumInArray.id === album.id) {
          albumInArray.tracks = albumTracks
        }
      })
    })
  }
}

      res.status(200).json({status: 200, message: "Spotify Content Found", data: {spotifyArtistName: artistName, spotifyArtistId: spotifyArtistId, spotifyAlbums: albums, spotifyTracks: tracks}})  
    } else { 
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

