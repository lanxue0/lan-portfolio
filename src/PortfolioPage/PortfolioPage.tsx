import { useRef } from "react";
import { Avatar, Card, Divider, Tag, Typography, Timeline } from "antd";
import {
  UserOutlined,
  MailOutlined,
  GithubOutlined,
  CopyrightOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";
import "./index.less";
import DynamicBackground from "../components/DynamicBackground";
import ThreeSVG from "../components/ThreeSVG";

// 导入SVG资源
import chinaMapPath from "../assets/china.svg";
import AiIntroduction from "../components/AiIntroduction";

const { Title, Paragraph, Text } = Typography;

const PortfolioPage = () => {
  // 滚动导航引用
  const aboutRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // 当前位置
  const currentLocation = "湖北";

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

        {/* 当前位置 */}
        <div className="sidebar-location">
          <EnvironmentOutlined style={{ marginRight: 5, color: "#ff4d4f" }} />
          <Text>{currentLocation}</Text>
        </div>

        {/* 模型展示 */}
        <div className="sidebar-model">
          <ThreeSVG
            width={180}
            height={180}
            svgPath={chinaMapPath}
            highlightLocation={currentLocation}
          />
        </div>

        <Divider style={{ margin: "12px 0" }} />

        {/* 导航 */}
        <div className="sidebar-nav">
          <button className="nav-btn" onClick={() => scrollToSection(aboutRef)}>
            关于我
          </button>
          <button
            className="nav-btn"
            onClick={() => scrollToSection(educationRef)}
          >
            教育经历
          </button>
          <button
            className="nav-btn"
            onClick={() => scrollToSection(skillsRef)}
          >
            技能
          </button>
          <button
            className="nav-btn"
            onClick={() => scrollToSection(experienceRef)}
          >
            经历
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
        <div className="sidebar-footer">
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <CopyrightOutlined /> {new Date().getFullYear()} lan
          </Text>
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
              <Paragraph>
                计算机科学与技术专业学生，专注于前端开发技术。
              </Paragraph>
              <Paragraph>
                拥有扎实的前端基础，熟悉现代前端框架与技术栈，有实际项目开发经验。
              </Paragraph>
            </Card>

            {/* AI自我介绍 */}
            <AiIntroduction />
          </div>

          {/* 教育经历 */}
          <div ref={educationRef} className="content-card">
            <Card
              className="ant-card-custom"
              title="教育经历"
              headStyle={{ fontWeight: 500 }}
              bordered={false}
            >
              <div className="education-item">
                <div className="education-header">
                  <Title level={5}>湖北大学</Title>
                  <Text type="secondary">
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    2021年09月 - 2025年06月
                  </Text>
                </div>
                <div className="education-content">
                  <Paragraph>
                    <strong>专业：</strong>计算机科学与技术 本科
                    计算机与信息工程学院
                  </Paragraph>
                  <Paragraph>
                    <strong>地点：</strong>武汉
                  </Paragraph>
                  <Paragraph>
                    <TrophyOutlined
                      style={{ marginRight: 8, color: "#faad14" }}
                    />
                    <strong>荣誉：</strong>三好学生，优秀共青团员，学院排名前10%
                  </Paragraph>
                  <Paragraph>
                    <TrophyOutlined
                      style={{ marginRight: 8, color: "#faad14" }}
                    />
                    <strong>证书：</strong>
                    蓝桥杯国三，团体程序设计天梯赛国三，icpc区域赛参赛经验，英语（CET-4）
                  </Paragraph>
                </div>
              </div>
            </Card>
          </div>

          {/* 技能 */}
          <div ref={skillsRef} className="content-card">
            <Card
              className="ant-card-custom"
              title="专业技能"
              headStyle={{ fontWeight: 500 }}
              bordered={false}
            >
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>前端开发</Title>
                <div style={{ marginTop: 8 }}>
                  <Tag color="blue">HTML5</Tag>
                  <Tag color="blue">CSS3</Tag>
                  <Tag color="blue">Flex布局</Tag>
                  <Tag color="blue">JavaScript</Tag>
                  <Tag color="blue">ES6</Tag>
                  <Tag color="blue">TypeScript</Tag>
                  <Tag color="blue">React</Tag>
                </div>
                <Paragraph style={{ marginTop: 12 }}>
                  掌握HTML，CSS，掌握flex布局，能够进行页面设计
                </Paragraph>
                <Paragraph>
                  熟悉JavaScript，ES6高级语法，了解TypeScript，能够使用TypeScript进行项目开发
                </Paragraph>
                <Paragraph>熟悉React，能用React进行项目开发</Paragraph>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={5}>其他技能</Title>
                <div style={{ marginTop: 8 }}>
                  <Tag color="green">Git</Tag>
                  <Tag color="green">计算机网络</Tag>
                  <Tag color="green">数据结构</Tag>
                  <Tag color="green">算法</Tag>
                  <Tag color="green">Node.js</Tag>
                </div>
                <Paragraph style={{ marginTop: 12 }}>
                  了解Git，能够基于Git进行团队开发
                </Paragraph>
                <Paragraph>
                  了解计算机网络，数据结构与算法，了解Node.js
                </Paragraph>
              </div>
            </Card>
          </div>

          {/* 经历 */}
          <div ref={experienceRef} className="content-card">
            <Card
              className="ant-card-custom"
              title="实习与社团经历"
              headStyle={{ fontWeight: 500 }}
              bordered={false}
            >
              <Title level={5}>
                <ExperimentOutlined style={{ marginRight: 8 }} />
                实习经历
              </Title>
              <div className="experience-item">
                <div className="experience-header">
                  <Title level={5}>武汉金山办公软件有限公司</Title>
                  <Text type="secondary">
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    2024年06月 - 2024年08月
                  </Text>
                </div>
                <Paragraph>
                  <strong>职位：</strong>前端开发实习生 |{" "}
                  <strong>部门：</strong>文档应用 | <strong>地点：</strong>武汉
                </Paragraph>
                <Paragraph style={{ fontWeight: 500, marginTop: 12 }}>
                  主要工作：
                </Paragraph>
                <ul className="experience-list">
                  <li>
                    针对AI助手与用户交互形式单一，开发了文档内容识别及填充的功能，支持用户传递文档的形式识别并分析出有效信息，并能够做到自动填充文档相关内容。
                  </li>
                  <li>
                    针对文档搜索时返回的文档列表数据项过多的问题，开发了文档数据项选择树，支持用户自定义需要展示的数据项，并保存为方案，从而支持用户在不同场景下使用不同的方案，查看自己需要的数据项。
                  </li>
                  <li>
                    实现了历史会话记录，近期多个历史会话会以列表形式展示从而支持用户进行访问。
                  </li>
                  <li>
                    实现了"你可能需要"模块，会统计用户搜索的高频关键词，并由AI模型进行联想和推测，从而得到用户可能需要查找的内容。
                  </li>
                  <li>
                    针对用户存在误删、悔删的情况，开发了文档回收站，支持用户自定义回收站大小，超过回收站大小时，自动清除最久的文档；支持自动清理回收站的功能，并支持用户自定义回收的文档的最大生命周期。
                  </li>
                </ul>
              </div>

              <Divider style={{ margin: "24px 0" }} />

              <Title level={5}>
                <TeamOutlined style={{ marginRight: 8 }} />
                社团和组织经历
              </Title>
              <Timeline
                style={{ marginTop: 16, marginLeft: 16 }}
                items={[
                  {
                    children: (
                      <div>
                        <Title level={5}>班级团支部</Title>
                        <Paragraph>职位：团支部书记</Paragraph>
                        <Paragraph>负责班级管理，组织和协调班级活动</Paragraph>
                      </div>
                    ),
                  },
                  {
                    children: (
                      <div>
                        <Title level={5}>学院本科生党支部</Title>
                        <Paragraph>职位：组织委员</Paragraph>
                        <Paragraph>
                          组织党支部党日活动，组织生活会等活动
                        </Paragraph>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </div>

          {/* 项目 */}
          <div ref={projectsRef} className="content-card">
            <Card
              className="ant-card-custom"
              title="项目经历"
              headStyle={{ fontWeight: 500 }}
              bordered={false}
            >
              <div className="project-item">
                <Title level={5}>埋点 SDK</Title>
                <ul className="project-list">
                  <li>
                    支持个性化配置，可以根据需求，选择性的开启性能监控，用户行为监控，错误监控，接口调用情况监控。
                  </li>
                  <li>
                    基于web-vitals，peformanceAPI，对FP，FCP，LCP，FID等关键指标；白屏时间，首次可交互时间，dom加载完成时间，页面完全加载时间关键时间点；dns耗时，tcp耗时，ssl耗时，请求响应耗时，内容传输耗时，dom解析耗时，资源加载耗时关键时间段；静态资源的缓存命中率进行了收集，以便于针对性优化。
                  </li>
                  <li>
                    支持对用户访问界面路径，标题，浏览器语种，内核，屏幕大小，设备类型，
                    ip， pv， uv，页面停留时间等数据进行采集。
                  </li>
                  <li>
                    支持用户行为栈对路由跳转，点击，ajax请求，自定义事件进行追踪，从而当线上异常时，可以进行用户行为及其数据的回溯，并在栈满时集中上传。
                  </li>
                  <li>
                    支持对用户来路地址，来路方式，进行收集，以便于分析当前网站引流源。
                  </li>
                  <li>
                    支持对js运行异常，promise异常，静态资源加载异常，
                    http请求异常，cors跨域异常进行监控和上报。
                  </li>
                </ul>
              </div>
              <Divider style={{ margin: "20px 0" }} dashed />
              <div className="project-item">
                <Title level={5}>交互式 3D 个人展示</Title>
                <ul className="project-list">
                  <li>
                    采用 React、TypeScript 及 Vite 构建高性能单页应用，结合 Ant
                    Design 和 Less
                    实现定制化、响应式的用户界面，确保在不同设备上的最佳浏览体验。
                  </li>
                  <li>
                    交互式 3D 地图可视化，集成 Three.js 实现动态 3D
                    中国地图展示，支持从 SVG
                    加载数据、模型挤压生成、鼠标悬停高亮交互、动态相机聚焦特定省份及固定高亮显示当前所在地。
                  </li>
                  <li>
                    集成 Deepseek AI
                    API，实现自动化生成个性化、专业化的个人介绍，通过异步请求处理加载与错误状态，提升内容独特性和吸引力。
                  </li>
                  <li>
                    利用 HTML5 Canvas 创建动态粒子背景，增强视觉效果；实现基于
                    useRef 的平滑滚动导航，方便用户快速浏览不同内容区域。
                  </li>
                </ul>
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
                邮箱: 1259700509@qq.com
              </Paragraph>
              <Paragraph>
                <GithubOutlined style={{ marginRight: 8 }} />
                GitHub: github.com/lanxue0/lan-portfolio#
              </Paragraph>
              <Paragraph>
                <BookOutlined style={{ marginRight: 8 }} />
                英语水平: CET-4
              </Paragraph>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
