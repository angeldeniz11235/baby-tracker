import axios from 'axios';
import getStrapiURL from './getStrapiURL';

export async function fetchUserData(jwt) {
  try {
    const url = getStrapiURL() + "/api";
    const response = await axios.get(url + "/users/me", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error.response);
    throw new Error('Failed to fetch user data. Please try again.');
  }
}