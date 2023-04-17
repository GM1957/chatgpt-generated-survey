import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function GET(req, res) {
  const parsedUrl = new URL(req.url);

  const { searchParams } = parsedUrl;

  const chat = searchParams.get("chat");
  const type = searchParams.get("type");

  let response = {};

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(chat, type),
      temperature: 0.6,
      max_tokens: 1000,
    });
    response = { text: completion.data.choices[0].text };
  } catch (err) {
    response = { error: "Unable to get Chat", err };
  }

  const jsonContent = JSON.stringify(response);

  console.log("jsonContent", jsonContent);

  return new Response(jsonContent, {
    headers: { "Content-Type": "application/json" },
  });
}

function generatePrompt(chat, type) {
  let choice = "";
  if (type === "multiple") {
    choice =
      "multiple choice questions (user should able to select multiple answers)";
  } else if (type === "single") {
    choice =
      "multiple choice questions (user should able to select only one answer from multiple options)";
  } else if (type === "open") {
    choice = "open ended questions where user will write answer in input";
  } else if (type === "mixed") {
    choice =
      "mixed type questions such as  multiple choice, single choice, open ended questions";
  }
  let prompt = `give only and only surveyJS json as output and not a single extra word, make the json for ${choice} from below survey description 
    ${chat}
    `;
  return prompt;
}
