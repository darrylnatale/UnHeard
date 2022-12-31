const smushString = (string) => {
  
  
    if (typeof string === "string") {
      return string.toLowerCase()
      .replace(/the/g, "")
      .replace(/and/g, "")
      .replace(/s/g, "")
      .replace(/[^0-9A-Za-z]/g, "");
    }
    
  
};

export default smushString;
