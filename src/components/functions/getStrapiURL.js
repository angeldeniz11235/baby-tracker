// Purpose: Get the Strapi URL based on the environment.

export default function getStrapiURL() {
    // Console log environment variables for debugging
    console.log("ENVIRONMENT: ", process.env.REACT_APP_ENVIRONMENT);
    console.log("PROD_STRAPI_URL: ", process.env.REACT_APP_PROD_STRAPI_URL);
    console.log("DEV_STRAPI_URL: ", process.env.REACT_APP_DEV_STRAPI_URL);
  
    const isProd = process.env.REACT_APP_ENVIRONMENT === "PROD";
    const baseUrl = isProd
      ? process.env.REACT_APP_PROD_STRAPI_URL
      : process.env.REACT_APP_DEV_STRAPI_URL;
    const url = `${baseUrl}`;
    return url;
  }