import dynamoDb from "@/lib/dynamodb";

export async function POST(req, res) {
  const user = await req.json();

  const params = {
    TableName: "Users",
    Item: {...user, timeStamp: "12"},
  };

  let response = {};

  try {
    const data = await dynamoDb.put(params).promise();
    console.log("data after", data)
    response = data;
  } catch (error) {
    console.error(error);
    response = { error: "Error creating user in DynamoDB" };
  }
  console.log("this is response from create user : ", response);
  return new Response(response);
}
