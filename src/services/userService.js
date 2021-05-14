import { getUserAttributes } from "../services/cognitoAuth";
const userApiURL = "https://api.moggies.io/user";

const getUserData = (currentUser) => {
  return new Promise((resolve, reject) => {
    getUserAttributes()
      .then(({ attributes, session }) => {
        const userId = attributes.filter((v, i) => v.Name == "sub")[0].Value;
        const url = `${userApiURL}/${userId}`;
        fetch(url, {
          headers: { Authorization: session.getIdToken().getJwtToken() },
        }).then((data) => resolve(data.json()));
      })
      .catch((err) => reject(err));
  });
};

export default {
  getUserData: getUserData,
};
