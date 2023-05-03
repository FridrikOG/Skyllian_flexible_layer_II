const ApiService = () => ({
  getData: (url) => {
    let ret = {};
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        ret = json.payloads;
        // console.log(ret)
      })
      .catch((e) => {
        console.log("error");
      });
  },
});

export default ApiService();
