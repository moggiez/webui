import config from "../config";
const organisationApiURL = `${config.baseApiUrl}/organisation`;

const getOrganisation = (currentUser) => {
  return new Promise((resolve, reject) => {
    userSvc
      .getUserData(currentUser)
      .then(({ userData, session }) => {
        const url = `${organisationApiURL}/${userData.OrganisationId}`;
        const config = {
          headers: {
            Authorization: session.getIdToken().getJwtToken(),
          },
        };
        axios
          .get(url, config)
          .then((response) => {
            resolve({ organisation: response.data, session });
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};
