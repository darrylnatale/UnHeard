const filter = (uniqueTracks) => {

    const filters = ["Remaster", "Remaaster","- Live", "Dub", "(Live)", "Acoustic", "Alternate Take", "Outtake", "- Take", "Maxi", "Mix", "Version", "Remix", "Edit", "Dub Mix", "Live at", "Club Mix", "World Tour", "Vocal", `12"`, `7"`, "Instrumental"]
    const filteredSongs = uniqueTracks.filter((song) => {
        
        return filters.every(filter => !song["trackName"].toLowerCase().includes(filter.toLowerCase()))
    }
        );

    return filteredSongs;
}
 
export default filter;