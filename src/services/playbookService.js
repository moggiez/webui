const playbookApiUrl = "https://api.moggies.io/playbook";

const getCustomerPlaybooks = (customerId, currentUser) => {
  return new Promise((resolve, reject) => {
    if (currentUser) {
      currentUser.getSession((err, result) => {
        if (err) {
          reject(err);
        } else {
          const url = `${playbookApiUrl}/${customerId}`;
          fetch(url, {
            headers: { Authorization: result.getIdToken().getJwtToken() },
          }).then((data) => resolve(data.json()));
        }
      });
    } else {
      reject();
    }
  });
};

export default {
  getCustomerPlaybooks: getCustomerPlaybooks,
};
