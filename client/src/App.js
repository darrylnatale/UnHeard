import {  useEffect, useState  } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components"

const App = () => {
  
const [albums, setAlbums] = useState()
const [artist, setArtist] = useState()
const [formData, setFormData] = useState()

// const { artistSearched } = useParams();

const artistSearched = "Venise"

useEffect(() => {
    fetch("/login")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log(err));
}, [])


// useEffect(() => {
  // fetch("/getTopAlbums") 
  //   .then((res) => res.json())
  //   .then((data) => {
  //       setAlbums(data.data.body.Albums)
  //    })
  //    .catch((err) => console.log(err));

//    fetch("/searchArtist") 
//      .then((res) => res.json())
//      .then((data) => {
//          setAlbums(data.data.body.Albums)
//       })
//       .catch((err) => console.log(err));
// }, [])



const handleChange = (value) => {
  setFormData(value);
  console.log(formData);
};

const handleSubmit = (e, formData) => {
  e.preventDefault();
  
  fetch(`/searchArtist/${formData}`) 
  .then((res) => res.json())
  .then((data) => {
      setArtist(data.data.body.artists.items)
      console.log(data.data.body.artists.items)
      console.log(data.data.body.artists.items[0].images[0].url)
      
   })
   .catch((err) => console.log(err));
}
const searchForAllAlbums = (artistId) => {
  fetch(`/getAllAlbums/${artistId}`) 
    .then((res) => res.json())
    .then((data) => {
        setAlbums(data.data.body)
        
     })
    
     .catch((err) => console.log(err));
}

  return (
    <Page>
      <form onSubmit={(e) => handleSubmit(e, formData)}>
      <input 
          type="search" 
          placeholder={"Search For An Artist"}
          onChange={(e) => handleChange(e.target.value)}/>
      <button type="submit">Search Artist</button>
      </form>
    <Results>
    {artist ? 
    <div><div>Artist Results</div>{artist.map((artist) => {
      return <ArtistContainer onClick={() => {searchForAllAlbums(artist.id)}
      }>
        {artist.images[0] ? <Image src={artist.images[0].url}/> : ""}        
        {artist.name} - {artist.id}
        </ArtistContainer>
    })}</div>
    : <>loading</>
    }

    {albums ? 
    <div>
      <div>Top Albums</div>
      {albums.items.map((album, index) => {
      return <div>
        {album.images[0] ? <Image src={album.images[0].url}/> : ""}        
        {index + 1} - {album.name}
        </div>
    })}</div>
    : <>loading</>
    }
    </Results>
    </Page>
  )
}




export default App;

const Page = styled.div`
display: block;
margin: 0 200px;
`

const Results = styled.div`
display: flex;`
const ArtistContainer = styled.button`
display: flex;
`

const Image = styled.img`
width: 125px;
`