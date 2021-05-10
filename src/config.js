
// const baseUrl = "http://localhost:5000/api/v1.0/";
const baseUrl = process.env.REACT_APP_API_URL;
//const imageUrl = "https://c706a43d45fa.ngrok.io";

export const environment = {
  production: true,
  baseUrl: `${baseUrl}`
};