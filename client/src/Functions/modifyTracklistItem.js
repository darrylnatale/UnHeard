const modifyTracklistItem = (tracklistItem, release, discogsArtistId) => {
    
    let renamedTracklistItem = Object.assign({}, tracklistItem, { trackName: tracklistItem.title });
    delete renamedTracklistItem.title;
    renamedTracklistItem.availableOn = "discogs";
    renamedTracklistItem.onAlbum = release;
    renamedTracklistItem.links = release.videos;
    renamedTracklistItem.albumRole = release.albumRole;


    if (tracklistItem.artists) {
      
        const artist = tracklistItem.artists.find((artist) => Number(artist.id) === Number(discogsArtistId));
        
    if (artist) {
            if (tracklistItem.type_ && tracklistItem.type_ === "heading"){
        renamedTracklistItem.artists = [{ name: artist.name, id: null }];
            } else {
        renamedTracklistItem.artists = [{ name: artist.name, id: artist.id }];
        renamedTracklistItem.trackRole = "Main";
            }
        }
    } else {
        renamedTracklistItem.artists = [{ name: release.artistName, id: null }];
        renamedTracklistItem.trackRole = "Main";
    }

    if (!tracklistItem.artists && tracklistItem.extraartists){
        const extraArtist = tracklistItem.extraartists.find((extraaartist) => Number(extraaartist.id) === Number(discogsArtistId));
        if (extraArtist){
            console.log("extraartistfound")
            renamedTracklistItem.trackRole = extraArtist.role
            renamedTracklistItem.artists = [{name: release.artistName + " & " + extraArtist.name + ` (${renamedTracklistItem.trackRole})`}]
        }
    }
    return renamedTracklistItem;
  };

export default modifyTracklistItem;