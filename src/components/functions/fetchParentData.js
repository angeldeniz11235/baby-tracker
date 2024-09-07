import axios from "axios";
import getStrapiURL from "./getStrapiURL";

export async function fetchParentData(user, jwt) {
  try {
    const url = getStrapiURL() + "/api";
    const parentResponse = await axios.get(
      url + `/parents?user=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("Fetched parent data:", parentResponse.data.data); // Debugging line
    const parents = parentResponse.data.data;
    const parent = parents.find((p) => p.attributes.email === user.email);
    if (parent) {
      console.log("Parent found:", parent); // Debugging line
      return parent;
    } else {
      throw new Error("Parent information not found for the current user.");
    }
  } catch (error) {
    console.error("Error fetching parent information:", error.response);
    throw new Error("Failed to fetch parent information. Please try again.");
  }
}
