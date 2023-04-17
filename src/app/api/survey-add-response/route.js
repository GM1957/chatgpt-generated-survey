import dynamoDb from "@/lib/dynamodb";

export async function PUT(req, res) {
  const jReq = await req.json();
  const { id, surveyResponse, surveyIndex, email } = jReq;

  const getParams = {
    TableName: "Users",
    Key: {
      id,
      timeStamp: "12",
    },
  };

  const getData = await dynamoDb.get(getParams).promise();

  console.log("getData", getData);

  const userData = getData?.Item;

  console.log("userData", userData);

  let meta = {};
  if (userData) {
    const userUpdateMeta = userData.meta;
    console.log("userUpdateMeta before", userUpdateMeta);
    userUpdateMeta?.surveys[surveyIndex]?.responses?.push({
      result: surveyResponse,
      submittedBy: email,
    });
    console.log("userUpdateMeta after", userUpdateMeta);
    meta = userUpdateMeta;
  }

  const params = {
    TableName: "Users",
    Key: {
      id,
      timeStamp: "12",
    },
    UpdateExpression: "SET #meta = :meta",
    ExpressionAttributeNames: {
      "#meta": "meta",
    },
    ExpressionAttributeValues: {
      ":meta": meta,
    },
    ReturnValues: "ALL_NEW",
  };

  let response = {};

  try {
    const data = await dynamoDb.update(params).promise();
    console.log("dynamo data", data);
    response = { message: "User updated successfully", data };
  } catch (error) {
    console.error(error);
    response = { error: "Error updating user in DynamoDB" };
  }
  const jsonContent = JSON.stringify(response);
  console.log("jsonContent: ", jsonContent);

  return new Response(jsonContent, {
    headers: { "Content-Type": "application/json" },
  });
}
