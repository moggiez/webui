import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "eu-west-1_NwekjaAN1",
  ClientId: "3rckmd7m0bp2mmahu9ieevllu0",
};

export default new CognitoUserPool(poolData);
