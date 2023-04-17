import dynamoDb from "@/lib/dynamodb";

export async function PUT(req, res) {
  const jReq = await req.json();
  const { id, password, ...updates } = jReq;

  const conditionExpression = "#pas = :pass";
  const expressionAttributeNames = {
    "#pas": "password",
  };

  const expressionAttributeValues = {
    ":pass": password,
  };

  const params = {
    TableName: "Users",
    Key: {
      id,
      timeStamp: "12",
    },
    UpdateExpression: `SET ${Object.keys(updates)
      .map((key, i) => `#${key} = :value${i}`)
      .join(", ")}`,
    ConditionExpression: conditionExpression,
    ExpressionAttributeNames: {
      ...expressionAttributeNames,
      ...Object.fromEntries(
        Object.keys(updates).map((key) => [`#${key}`, key])
      ),
    },
    ExpressionAttributeValues: {
      ...expressionAttributeValues, // Fixed this line
      ...Object.values(updates).reduce(
        (acc, value, i) => ({ ...acc, [`:value${i}`]: value }),
        {}
      ),
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
