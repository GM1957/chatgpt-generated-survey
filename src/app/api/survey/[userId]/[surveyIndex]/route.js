import dynamoDb from "@/lib/dynamodb";

export async function GET(req, res) {
  const { userId, surveyIndex } = res.params;

  const params = {
    TableName: "Users",
    Key: {
      id: userId,
      timeStamp: "12",
    },
  };

  let response = {};

  try {
    const data = await dynamoDb.get(params).promise();
    if (data?.Item?.meta?.surveys[surveyIndex]) {
      response = data?.Item?.meta?.surveys[surveyIndex];
    } else {
      response = { error: "Survey not found" };
    }
  } catch (error) {
    console.error(error);
    response = { error: "Error fetching Survey from DynamoDB" };
  }

  const jsonContent = JSON.stringify(response);
  console.log("jsonContent: ", jsonContent);

  return new Response(jsonContent, {
    headers: { "Content-Type": "application/json" },
  });
}
