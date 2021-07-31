import "crypto-js/lib-typedarrays";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CookieStorage,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_POOL_ID;
const clientId = process.env.NEXT_PUBLIC_COGNITO_APP; // the cognito client application id
let domain = ".moggies.io";

if (process.env.NEXT_PUBLIC_DOMAIN) {
  domain = process.env.NEXT_PUBLIC_DOMAIN;
}
console.log("domain is", domain);
console.log("process.env is", process.env);
const storage = new CookieStorage({
  domain: domain,
});

const UserPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
  Storage: storage,
});

const getUserData = (username) => {
  return {
    Pool: UserPool,
    Username: username,
    Storage: storage,
  };
};

const getCurrentUser = () => {
  return UserPool.getCurrentUser();
};

const getUserByUsername = (username) => {
  return new CognitoUser(getUserData(username));
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
    const user = new CognitoUser(getUserData(email));
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

const getUserAttributes = async () => {
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

const makepass = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numeric = "0123456789";

  const charactersLength = characters.length;
  const symbolCharacters = "!_-?:#";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result += symbolCharacters.charAt(
    Math.floor(Math.random() * symbolCharacters.length)
  );
  result += numeric.charAt(Math.floor(Math.random() * numeric.length));
  return result;
};

const inviteUser = async (email, invitedBy, orgId) => {
  console.log("inviteUser", email, invitedBy, orgId);
  return new Promise((resolve, reject) => {
    const attributeList = [];
    const dataEmail = {
      Name: "email",
      Value: email,
    };
    const dataInvitedBy = {
      Name: "custom:orgInviteBy",
      Value: invitedBy,
    };
    const dataOrgId = {
      Name: "custom:organisationId",
      Value: orgId,
    };
    attributeList.push(new CognitoUserAttribute(dataEmail));
    attributeList.push(new CognitoUserAttribute(dataInvitedBy));
    attributeList.push(new CognitoUserAttribute(dataOrgId));
    const password = makepass(10);
    UserPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const cognitoUser = result.user;
        resolve(cognitoUser);
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
  inviteUser,
};
