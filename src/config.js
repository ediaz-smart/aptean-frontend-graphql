
// const baseUrl = "http://localhost:5000/api/v1.0/";
const baseUrl = process.env.REACT_APP_API_URL;
//const imageUrl = "https://c706a43d45fa.ngrok.io";

export const environment = {
  production: true,
  baseUrl: `${baseUrl}`
};

export const supportMail = "support@gqlifesciences.com";
export const usBaseUrl = "http://www.uspto.gov/web/patents/classification/";
export const ipcBaseUrl = "http://web2.wipo.int/ipcpub/#refresh=page&notion=scheme&version=20130101&symbol=";
export const ipcrBaseUrl = "http://web2.wipo.int/ipcpub/#refresh=page&notion=scheme&version=20130101&symbol=";
export const cpcBaseUrl = "http://worldwide.espacenet.com/classification#!/CPC=";