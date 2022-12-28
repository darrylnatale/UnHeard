.post("/EndpointName", async (req, res) => {
    console.log(req.body)
    
    let {... , ...} = req.body
    
      try {
        const ... = await db.getDiscogsArtistReleases(...,...)
        if(...){
            res.status(200).json({status: 200, message: "...", data: ... })
        } else {
            res.status(400).json({status: 400, message: "...", data: ... })
        }
      }
      catch (err){
        res.status(404).json({status: 404, message: "problem with api", data: err })
      }
    
  })