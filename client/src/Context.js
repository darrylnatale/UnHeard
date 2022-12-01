
import {useState, createContext} from "react"

export const Context = createContext(null)

const Provider = ({children}) => {
    const [answer, setAnswer] = useState(null)
    const [albums, setAlbums] = useState()
    const [correctGuess, setCorrectGuess] = useState(undefined)
    const [spotifySearchResults, setSpotifySearchResults] = useState()
    const [selectedArtist, setSelectedArtist] = useState()
    const [spotifyAlbums, setSpotifyAlbums] = useState()
    const [formData, setFormData] = useState()
    const [allSpotifyTracks, setAllSpotifyTracks] = useState()
    const [allSpotifyTrackNames, setAllSpotifyTrackNames] = useState()
    const [submitted, setSubmitted] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [timedTracks, setTimedTracks] = useState([])
    const [allTracksFromBoth, setAllTracksFromBoth] = useState()

    const [discogsSearchResults, setDiscogsSearchResults] = useState([])
    const [discogsAlbums, setDiscogsAlbums] = useState()
    const [discogsAlbumDetails, setDiscogsAlbumDetails] = useState()
    const [discogsVersions, setDiscogsVersions] = useState()
    const [discogsTrackNames, setDiscogsTrackNames] = useState()
    const [discogsArtistId, setDiscogsArtistId] = useState()
    
    return <Context.Provider value={{
        answer,
        setAnswer,
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
        formData,
        setFormData,
        allSpotifyTracks,
        setAllSpotifyTracks,
        allSpotifyTrackNames,
        setAllSpotifyTrackNames,
        submitted,
        setSubmitted,
        seconds,
        setSeconds,
        timedTracks,
        setTimedTracks,
        allTracksFromBoth,
        setAllTracksFromBoth,
        discogsAlbums,
        setDiscogsAlbums,
        discogsAlbumDetails,
        setDiscogsAlbumDetails,
        discogsVersions,
        setDiscogsVersions,
        discogsTrackNames,
        setDiscogsTrackNames,
        discogsArtistId, 
        setDiscogsArtistId
    }}>
        {children}
    </Context.Provider>
}

export default Provider

