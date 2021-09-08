const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
  region: "eu-west-1",
});

// Load AWS SES
const ses = new aws.SES({ apiVersion: "2010-12-01" });

export default (req, res) => {
  const body = req.body;

  const params = {
    Source: process.env.AMAZON_SES_CONTACT_EMAIL,
    Destination: { ToAddresses: [process.env.AMAZON_SES_CONTACT_EMAIL] },
    Message: {
      Subject: {
        Data: `Contact form submission`,
      },
      Body: {
        Text: {
          Data: `
                    Name: ${body.name}\n
                    Email: ${body.email}\n
                    Message: ${body.message}\n
                  `,
        },
      },
    },
  };

  return ses
    .sendEmail(params)
    .promise()
    .then((data) => {
      res.send({ status: "success" });
    })
    .catch((error) => {
      console.log("contact error", error);
      const response = {
        status: "error",
      };

      if (process.env.DEBUG === "TRUE") {
        response["detail"] = error;
        response["env"] = process.env;
      }
      res.send(response);
    });
};
