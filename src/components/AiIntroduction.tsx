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

  // 从环境变量获取API密钥
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const handleGenerateIntroduction = async () => {
    setIsLoading(true);
    try {
      // 检查API密钥是否存在
      if (!apiKey) {
        throw new Error(
          "未设置API密钥，请在.env文件中设置VITE_DEEPSEEK_API_KEY"
        );
      }

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "你是一个专业的助手，负责为软件工程师生成职业介绍。请根据以下信息生成一段专业的自我介绍：\n\n" +
              "实习经历：\n" +
              "1. 在武汉金山办公软件有限公司担任前端开发实习生，负责文档应用开发\n" +
              "2. 开发了文档内容识别及填充功能，支持用户传递文档的形式识别并分析出有效信息\n" +
              "3. 实现了文档数据项选择树，支持用户自定义展示数据项并保存为方案\n" +
              "4. 开发了历史会话记录功能，支持用户访问近期会话\n" +
              "5. 实现了'你可能需要'模块，通过AI模型分析用户搜索关键词进行智能推荐\n" +
              "6. 开发了文档回收站功能，支持自定义回收站大小和自动清理\n\n" +
              "项目经历：\n" +
              "1. 开发了埋点SDK，支持性能监控、用户行为监控、错误监控等功能\n" +
              "2. 实现了基于web-vitals的性能指标收集，包括FP、FCP、LCP等关键指标\n" +
              "3. 开发了用户行为追踪系统，支持路由跳转、点击、ajax请求等事件追踪\n" +
              "4. 实现了异常监控系统，包括js运行异常、promise异常、静态资源加载异常等\n" +
              "5. 开发了交互式3D个人展示项目，使用React、TypeScript和Three.js实现\n\n" +
              "请用简洁、专业的语言描述他的技能和专长。回复应该是第一人称的，不超过150字，突出他的技术能力和项目经验。不要使用'我是'开头，直接以'软件工程师，擅长'等开头。技术栈包括：React、TypeScript、Three.js、WebGL、CSS3、响应式设计等。",
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
      setIntroduction(
        error instanceof Error
          ? error.message
          : "生成自我介绍时出错，请稍后再试"
      );
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
