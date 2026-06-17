const API_URL = "https://orion-dewp.onrender.com/";

export const getHello = async () => {
  const response = await fetch(API_URL);
  return await response.text();
};
const data = await res.json();