export const AppConfig = {
  apiUrl: process.env.REACT_APP_API_URL,
};
console.log(process.env.REACT_APP_API_URL);
export const ImageConfig = {
  apiUrl: process.env.IMAGE_API_URL
    ? process.env.IMAGE_API_URL
    : "http://localhost:80/article/",
  routerBase: process.env.IMAGE_ROUTER_BASE || "",
};

export const connectIdentity = process.env.REACT_APP_CONNECT_IDENTITY;
