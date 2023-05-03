const env = process.env.NODE_ENV;

let uri;

if (env === "development") uri = `http://localhost:8080/`;
else {
  uri = `http://localhost:8080/`;
}

export default uri;
