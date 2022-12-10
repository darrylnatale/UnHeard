const cleanUp = (array) => {
  return array.map((item) => {
    if (typeof item === "string") {
      return item.replace(/[^0-9A-Za-z]/g, "");
    }
    return item;
  });
};

export default cleanUp;
