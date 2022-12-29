const smushString = (string) => {
  
  
    if (typeof string === "string") {
      return string.toLowerCase().replace(/[^0-9A-Za-z]/g, "");
    }
    
  
};

export default smushString;
