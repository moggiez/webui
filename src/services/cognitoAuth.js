import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
const userPoolId = "eu-west-1_NwekjaAN1";
const clientId = "3rckmd7m0bp2mmahu9ieevllu0"; // the cognito client application id

const UserPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
});

const getCurrentUser = () => {
  return UserPool.getCurrentUser();
};

const getUserByUsername = (username) => {
  return new CognitoUser({
    Pool: UserPool,
    Username: username,
  });
};

const authenticateUser = (username, password) => {
  const user = getUserByUsername(username);
  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authDetails = new AuthenticationDetails(authenticationData);
  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        resolve(user, accessToken);
      },
      onFailure: (err) => reject(err),
    });
  });
};

const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: UserPool,
    };
    const user = new CognitoUser(userData);
    user.forgotPassword({
      onSuccess: function (data) {
        resolve(data);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
};

const changePassword = (username, password, verificationCode) => {
  return new Promise((resolve, reject) =>
    getUserByUsername(username).confirmPassword(verificationCode, password, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    })
  );
};

const getUserAttributes = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = UserPool.getCurrentUser();
    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
      } else {
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
          } else {
            resolve({ attributes, session });
          }
        });
      }
    });
  });
};

export {
  UserPool,
  getUserByUsername,
  authenticateUser,
  getCurrentUser,
  forgotPassword,
  changePassword,
  getUserAttributes,
};
