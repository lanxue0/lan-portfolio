import { useRef } from "react";
import { Avatar, Card, Divider, Tag, Typography } from "antd";
import { UserOutlined, MailOutlined, GithubOutlined } from "@ant-design/icons";
import "./index.less";
import DynamicBackground from "./DynamicBackground";

const { Title, Paragraph } = Typography;

const PortfolioPage = () => {
  // 滚动导航引用
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // 滚动到指定区域
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="portfolio">
      {/* 动态背景 */}
      <DynamicBackground
        pointsCount={80}
        lineDistance={150}
        pointRadius={2}
        speed={0.3}
      />

      {/* 左侧固定区域 */}
      <div className="portfolio-sidebar">
        <div className="sidebar-avatar">
          <Avatar size={100} icon={<UserOutlined />} />
        </div>
        <div className="sidebar-name">lan</div>
        <div className="sidebar-title">前端开发工程师</div>

        <Divider style={{ margin: "12px 0" }} />

        {/* 导航 */}
        <div className="sidebar-nav">
          <button className="nav-btn" onClick={() => scrollToSection(aboutRef)}>
            关于我
          </button>
          <button
            className="nav-btn"
            onClick={() => scrollToSection(skillsRef)}
          >
            技能
          </button>
          <button
            className="nav-btn"
            onClick={() => scrollToSection(projectsRef)}
          >
            项目
          </button>
          <button
            className="nav-btn"
            onClick={() => scrollToSection(contactRef)}
          >
            联系
          </button>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="portfolio-content">
        <div className="content-list">
          {/* 关于我 */}
          <div ref={aboutRef} className="content-card">
            <Card
              className="ant-card-custom"
              title="关于我"
              headStyle={{ fontWeight: 500 }}
              bordered={false}
            >
              <Paragraph>前端开发工程师。</Paragraph>
              <Paragraph>技术栈：React, WebGL, Three.js等。</Paragraph>
            </Card>
          </div>

          {/* 技能 */}
          <div ref={skillsRef} className="content-card">
            <Card
              className="ant-card-custom"
              title="技能"
              headStyle={{ fontWeight: 500 }}
              bordered={false}
            >
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>前端开发</Title>
                <div style={{ marginTop: 8 }}>
                  <Tag color="blue">React</Tag>
                  <Tag color="blue">Vue</Tag>
                  <Tag color="blue">JavaScript</Tag>
                  <Tag color="blue">TypeScript</Tag>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={5}>3D可视化</Title>
                <div style={{ marginTop: 8 }}>
                  <Tag color="green">Three.js</Tag>
                  <Tag color="green">WebGL</Tag>
                </div>
              </div>

              <div>
                <Title level={5}>UI/UX</Title>
                <div style={{ marginTop: 8 }}>
                  <Tag color="orange">CSS3</Tag>
                  <Tag color="orange">LESS/SASS</Tag>
                  <Tag color="orange">响应式设计</Tag>
                </div>
              </div>
            </Card>
          </div>

          {/* 项目 */}
          <div ref={projectsRef} className="content-card">
            <Card
              className="ant-card-custom"
              title="项目"
              headStyle={{ fontWeight: 500 }}
              bordered={false}
            >
              <div className="project-item">
                <Title level={5}>项目一</Title>
                <Paragraph>xxx</Paragraph>
              </div>
              <Divider style={{ margin: "12px 0" }} dashed />
              <div className="project-item">
                <Title level={5}>项目二</Title>
                <Paragraph>xxx</Paragraph>
              </div>
            </Card>
          </div>

          {/* 联系 */}
          <div ref={contactRef} className="content-card">
            <Card
              className="ant-card-custom"
              title="联系我"
              headStyle={{ fontWeight: 500 }}
              bordered={false}
            >
              <Paragraph>
                <MailOutlined style={{ marginRight: 8 }} />
                邮箱: xxx@xxx.com
              </Paragraph>
              <Paragraph>
                <GithubOutlined style={{ marginRight: 8 }} />
                GitHub: github.com/xxx
              </Paragraph>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
