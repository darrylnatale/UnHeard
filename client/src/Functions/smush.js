const smush = (array) => {
  
  return array.map((item) => {
    if (typeof item["trackName"] === "string") {
      return item["trackName"].toLowerCase()
      .replace(/the/g, "")
      .replace(/and/g, "")
      .replace(/s/g, "")
      .replace(/[^0-9A-Za-z]/g, "");
    }
    return item;
  });
};

export default smush;
