

const getDiscogsContent = (discogsArtistId) => {
    
    

    fetch(`/getDiscogsContent/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({discogsArtistId}),
      }) 
          .then((res) => res.json())
          .then((data) => {
            console.log("content from discogs", data)
            return data.data
        })
        .catch((err) => console.log(err));
}

export default getDiscogsContent;