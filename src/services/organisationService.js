const organisationApiURL = `https://organisations-api.moggies.io`;

const getOrganisation = (currentUser) => {
  return new Promise((resolve, reject) => {
    userSvc
      .getUserData()
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
