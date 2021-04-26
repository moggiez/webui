const playbookApiUrl = "https://api.moggies.io/playbook";

const getCustomerPlaybooks = (customerId) => {
  const url = `${playbookApiUrl}/${customerId}`;
  return fetch(url).then((data) => data.json());
};

export default {
  getCustomerPlaybooks: getCustomerPlaybooks,
};
