import { useState } from "react";
import { Button, Spin, Typography } from "antd";
import { RobotOutlined, SyncOutlined } from "@ant-design/icons";
import OpenAI from "openai";
import "./AiIntroduction.css";

const { Text } = Typography;

const AiIntroduction = () => {
  const [introduction, setIntroduction] = useState<string>(
    "点击下方按钮，AI将基于您的技能和经验生成一段专业的自我介绍"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: "sk-3f3bc3668e5e4888a62d298a38e2b007",
    dangerouslyAllowBrowser: true,
  });

  const handleGenerateIntroduction = async () => {
    setIsLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "你是一个专业的助手，负责为软件工程师生成职业介绍。请用简洁、专业的语言描述他的技能和专长。回复应该是第一人称的，不超过150字，突出他的技术能力和项目经验。不要使用'我是'开头，直接以'软件工程师，擅长'等开头。技术栈包括：React、Vue、TypeScript、WebGL、Three.js、CSS3、响应式设计等。",
          },
        ],
        model: "deepseek-chat",
      });

      if (completion.choices[0].message.content) {
        setIntroduction(completion.choices[0].message.content.trim());
        setIsGenerated(true);
      }
    } catch (error) {
      console.error("生成介绍时出错:", error);
      setIntroduction("生成自我介绍时出错，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-introduction-container">
      <div className="ai-introduction-header">
        <RobotOutlined className="ai-icon" />
        <Text strong>AI生成介绍</Text>
      </div>
      <div className="ai-introduction-content">
        {isLoading ? (
          <div className="loading-container">
            <Spin indicator={<SyncOutlined spin />} tip="正在生成介绍..." />
          </div>
        ) : (
          <div className="introduction-text">{introduction}</div>
        )}

        <div className="ai-button-container">
          <Button
            type="primary"
            onClick={handleGenerateIntroduction}
            disabled={isLoading}
            icon={isGenerated ? <SyncOutlined /> : <RobotOutlined />}
          >
            {isGenerated ? "重新生成" : "生成AI自我介绍"}
          </Button>
        </div>
        {isGenerated && (
          <div className="ai-footer">
            <Text type="secondary" className="ai-powered-by">
              由Deepseek AI提供支持
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiIntroduction;
