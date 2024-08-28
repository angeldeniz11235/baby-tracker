import axios from 'axios';

export async function fetchUserData(jwt) {
  try {
    const response = await axios.get("http://localhost:1337/api/users/me", {
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