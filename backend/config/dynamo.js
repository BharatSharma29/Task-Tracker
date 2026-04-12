// config/dynamo.js
// This file sets up connection with AWS DynamoDB

import AWS from "aws-sdk";

// Make sure your AWS region matches your lab
AWS.config.update({
  region: "us-east-1",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export default dynamoDB;