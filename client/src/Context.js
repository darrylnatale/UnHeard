
import {useState, createContext} from "react"

export const Context = createContext(null)

const Provider = ({children}) => {
    const [animationIndex, setAnimationIndex] = useState(0)

    const [exactSpotifyNameMatch, setExactSpotifyNameMatch] = useState(null)
    const [albums, setAlbums] = useState()
    const [correctGuess, setCorrectGuess] = useState(undefined)
    const [spotifySearchResults, setSpotifySearchResults] = useState()
    const [selectedArtist, setSelectedArtist] = useState()
    const [spotifyAlbums, setSpotifyAlbums] = useState()
    const [searchFormData, setSearchFormData] = useState()
    const [allSpotifyTrackNames, setAllSpotifyTrackNames] = useState()
    const [allDiscogsTrackNames, setAllDiscogsTrackNames ] = useState()
    const [submitted, setSubmitted] = useState(false)
    const [allTracksFromBoth, setAllTracksFromBoth] = useState()
    const [discogsSearchResults, setDiscogsSearchResults] = useState([])
    const [discogsContent, setDiscogsContent] = useState()
    const [spotifyContent, setSpotifyContent] = useState()
    const [discogsTrackNames, setDiscogsTrackNames] = useState()
    const [discogsArtistIdState, setDiscogsArtistIdState] = useState()
    
    const [isInMongo, setIsInMongo] = useState()
    
    return <Context.Provider value={{
        animationIndex,
        setAnimationIndex,
        exactSpotifyNameMatch,
        setExactSpotifyNameMatch,
        albums,
        setAlbums,
        correctGuess,
        setCorrectGuess,
        discogsSearchResults,
        setDiscogsSearchResults,
        spotifySearchResults,
        setSpotifySearchResults,
        selectedArtist,
        setSelectedArtist,
        spotifyAlbums,
        setSpotifyAlbums,
        searchFormData,
        setSearchFormData,
        allSpotifyTrackNames,
        setAllSpotifyTrackNames,
        submitted,
        setSubmitted,
        allTracksFromBoth,
        setAllTracksFromBoth,
        discogsContent,
        setDiscogsContent,
        spotifyContent,
        setSpotifyContent,
        discogsTrackNames,
        setDiscogsTrackNames,
        discogsArtistIdState, 
        setDiscogsArtistIdState,
        allDiscogsTrackNames,
        setAllDiscogsTrackNames,
        isInMongo, 
        setIsInMongo
    }}>
        {children}
    </Context.Provider>
}

export default Provider

