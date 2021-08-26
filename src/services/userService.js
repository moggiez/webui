import { getUserAttributes } from "../services/cognitoAuth";
import axios from "axios";

const userApiURL = `https://users-api.moggies.io`;

const getUserData = async () => {
  try {
    const { attributes, session } = await getUserAttributes();
    const userId = attributes.filter((v, i) => v.Name == "sub")[0].Value;
    const url = `${userApiURL}/${userId}`;
    const config = {
      headers: {
        Authorization: session.getIdToken().getJwtToken(),
      },
    };
    try {
      const response = await axios.get(url, config);
      return { userData: response.data, session };
    } catch (getErr) {
      throw getErr;
    }
  } catch (err) {
    throw err;
  }
};

export default {
  getUserData: getUserData,
};
