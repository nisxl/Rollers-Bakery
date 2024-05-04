import axios from "axios";

const CHATGPT_API_URL =
  "https://api.openai.com/v1/engine/<engine-id>/completions";

function generateChatResponse(prompt) {
  const data = {
    prompt: prompt,
    max_tokens: 50,
    n: 1,
    stop: "\n",
    temperature: 0.7,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      process.env.sk - MdTkdzgnWmBDjVMfoUMxT3BlbkFJoQgwLMu77m4XQmx15tWy
    }`,
  };

  return axios
    .post(CHATGPT_API_URL, data, { headers: headers })
    .then((response) => {
      const chatResponse = response.data.choices[0].text.trim();
      return chatResponse;
    })
    .catch((error) => {
      console.log(error);
      return "Sorry, I'm having trouble understanding you.";
    });
}
