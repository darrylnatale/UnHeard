const functionName = (param1, param2) => {
    
    fetch(`/endPointName/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({param1, param2}),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.data)
    })
    .catch((err) => console.log(err));
  }