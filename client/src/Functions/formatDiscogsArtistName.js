const formatDiscogsArtistName = (discogsArtistName) => {

    const containsNumbers = (str) => {
        return /\d/.test(str);
      }
    
      if (
        (discogsArtistName.charAt(discogsArtistName.length-1) === ")") && 
        (containsNumbers(discogsArtistName.charAt(discogsArtistName.lastIndexOf(")")-1)))
        )
        {
        
       const lastIndexOfOpenParentheses = discogsArtistName.lastIndexOf("(")
      
       return discogsArtistName.slice(0,lastIndexOfOpenParentheses-1)
      } else {
        return discogsArtistName
      }
      
    
    
}
 
export default formatDiscogsArtistName;