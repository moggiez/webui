import { getUserAttributes } from "../services/cognitoAuth";
import config from "../config";
import axios from "axios";

const userApiURL = `${config.baseApiUrl}/user`;

const getUserData = (currentUser) => {
  return new Promise((resolve, reject) => {
    getUserAttributes()
      .then(({ attributes, session }) => {
        const userId = attributes.filter((v, i) => v.Name == "sub")[0].Value;
        const url = `${userApiURL}/${userId}`;
        const config = {
          headers: {
            Authorization: session.getIdToken().getJwtToken(),
          },
        };
        axios
          .get(url, config)
          .then((response) =>
            resolve({ userData: response.data.data[0], session })
          )
          .catch((error) => rekect(error));
      })
      .catch((err) => reject(err));
  });
};

export default {
  getUserData: getUserData,
};
