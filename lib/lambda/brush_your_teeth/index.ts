import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({});
export const handler = async () => {
  await ses.send(
    new SendEmailCommand({
      Source: "no-reply@cdk-test.com",
      Destination: {
        ToAddresses: ["davidarevaloc20@gmial.com"],
      },
      Message: {
        Body: {
          Text: {
            Data: "It's time to brush your teeth!",
            Charset: "UTF-8",
          },
        },
        Subject: {
          Data: "Brush your teeth!",
          Charset: "UTF-8",
        },
      },
    }),
  );
};
