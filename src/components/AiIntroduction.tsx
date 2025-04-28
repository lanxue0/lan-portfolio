import { Button } from "antd";
import OpenAI from "openai";

const AiIntroduction = () => {
  console.log("jinru");
  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: "sk-3f3bc3668e5e4888a62d298a38e2b007",
    dangerouslyAllowBrowser: true,
  });
  console.log("new");
  const handleStartAi = async () => {
    console.log("start");
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a hhelpful assistant." }],
      model: "deepseek-chat",
    });
    console.log(completion.choices[0].message.content);
  };

  return (
    <div>
      <Button onClick={handleStartAi}>点击对话ai</Button>
    </div>
  );
};

export default AiIntroduction;
