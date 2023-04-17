import dynamoDb from "@/lib/dynamodb";

export async function POST(req, res) {
  
  const { id, password } = await req.json();

  const params = {
    TableName: "Users",
    Key: {
      id,
      timeStamp: "12",
    },
  };

  let response = {};

  try {
    const data = await dynamoDb.get(params).promise();
    if (data?.Item?.password === password) {
      response = { user: data.Item };
    } else {
      response = { error: "password" };
    }
  } catch (error) {
    console.error(error);
    response = { error: "Error fetching user from DynamoDB" };
  }

  const jsonContent = JSON.stringify(response);
  console.log("jsonContent: ", jsonContent);

  return new Response(jsonContent, {
    headers: { "Content-Type": "application/json" },
  });
}
