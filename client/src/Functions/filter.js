const filter = (uniqueTracks) => {

    const filters = ["Remaster", "Remaaster","- Live", "(Live)", "Acoustic", "Alternate Take", "Outtake", "- Take", "Maxi", "Remix", "Edit", "Dub", "Live at", "Mix", "World Tour", "Vocal", "12", "Club", "Instrumental"];
    const maybeInclude = ["Version"]
    const filteredSongs = uniqueTracks.filter((song) => {
        
        return filters.every(filter => !song.toLowerCase().includes(filter.toLowerCase()))
    }
        );

    return filteredSongs;
}
 
export default filter;