const env = process.env.NODE_ENV;

let uri;

if (env === "development") uri = "http://localhost:8000/";
else {
  uri = "http://django-env2.eba-kwwanqub.eu-west-2.elasticbeanstalk.com/";
}
// update
// uri = "http://savegame-env.eba-fijpimur.eu-west-2.elasticbeanstalk.com/";

export default uri;
