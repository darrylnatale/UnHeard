const areSimilar = (a, b, threshold) => {
    // Calculate the Levenshtein distance between the two strings
    const distance = levenshteinDistance(a, b);
  
    // If the distance is below the threshold, consider the strings to be similar
    return distance < threshold;
  }

  export default areSimilar;