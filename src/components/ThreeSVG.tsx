import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ThreeSVGProps {
  width?: number;
  height?: number;
  svgPath: string;
  highlightLocation?: string;
}

const ThreeSVG: React.FC<ThreeSVGProps> = ({
  width = 200,
  height = 200,
  svgPath,
  highlightLocation,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    text: string;
    x: number;
    y: number;
  }>({
    show: false,
    text: "",
    x: 0,
    y: 0,
  });

  // 增加一个引用来存储固定高亮的模型
  const fixedHighlightedRef = useRef<{
    mesh: THREE.Mesh | null;
    border: THREE.LineSegments | null;
  }>({
    mesh: null,
    border: null,
  });

  useEffect(() => {
    if (!mountRef.current || !svgPath) return;

    // 基础场景设置
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    // 创建一个控制器引用，用于在不同函数间共享
    const controlsRef = { current: null as OrbitControls | null };

    // 用于鼠标交互的射线投射器
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 存储当前高亮的对象和其原始材质
    let highlightedMesh: THREE.Mesh | null = null;
    let originalMaterial: THREE.Material | null = null;
    let highlightedBorder: THREE.LineSegments | null = null;

    // 创建高亮材质
    const highlightMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xff0000), // 红色高亮
      emissive: new THREE.Color(0x331111), // 轻微自发光效果
      shininess: 100,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    // 边框高亮材质
    const borderHighlightMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000, // 红色高亮边框
      linewidth: 2,
    });

    // 创建固定高亮材质 - 使用不同色调以区分鼠标悬停
    const fixedHighlightMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xff4500), // 橙红色高亮
      emissive: new THREE.Color(0x331100), // 轻微自发光效果
      shininess: 100,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    // 固定高亮边框材质
    const fixedBorderHighlightMaterial = new THREE.LineBasicMaterial({
      color: 0xff4500, // 橙红色高亮边框
      linewidth: 2,
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 创建一个组来存放SVG内容
    const svgGroup = new THREE.Group();
    scene.add(svgGroup);

    // 存储可交互的网格和边框对
    const interactiveModels: {
      mesh: THREE.Mesh;
      border: THREE.LineSegments;
      title?: string;
    }[] = [];

    // 加载SVG
    const loader = new SVGLoader();

    // 首先加载SVG文件以获取原始内容，用于提取标题
    fetch(svgPath)
      .then((response) => response.text())
      .then((svgText) => {
        // 创建临时DOM解析SVG内容
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

        // 继续使用SVGLoader加载SVG
        loader.load(
          svgPath,
          (data) => {
            const paths = data.paths;

            // 确定SVG的边界
            let minX = Infinity;
            let maxX = -Infinity;
            let minY = Infinity;
            let maxY = -Infinity;

            for (let i = 0; i < paths.length; i++) {
              const path = paths[i];
              for (let j = 0; j < path.subPaths.length; j++) {
                const subPath = path.subPaths[j];
                for (let k = 0; k < subPath.getPoints().length; k++) {
                  const point = subPath.getPoints()[k];
                  minX = Math.min(minX, point.x);
                  maxX = Math.max(maxX, point.x);
                  minY = Math.min(minY, point.y);
                  maxY = Math.max(maxY, point.y);
                }
              }
            }

            const svgWidth = maxX - minX;
            const svgHeight = maxY - minY;

            // 计算适当的缩放比例和居中偏移
            const scale = Math.min(6 / svgWidth, 6 / svgHeight);
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            paths.forEach((path, pathIndex) => {
              const fillColor = path.userData?.style.fill;
              const strokeColor = path.userData?.style.stroke;

              // 尝试从SVG中获取路径的标题
              let pathTitle: string | undefined;

              // 查找对应路径元素的ID
              if (path.userData?.node) {
                const pathId = path.userData.node.id;

                // 1. 尝试从title子元素获取标题
                const titleElements = svgDoc.querySelectorAll(
                  `#${pathId} > title`
                );
                if (titleElements.length > 0) {
                  pathTitle = titleElements[0].textContent || undefined;
                }

                // 2. 尝试从title属性获取标题
                if (!pathTitle && path.userData.node.hasAttribute("title")) {
                  pathTitle =
                    path.userData.node.getAttribute("title") || undefined;
                }

                // 3. 如果没有标题，使用ID
                if (!pathTitle && pathId) {
                  pathTitle = pathId;
                }
              }

              // 如果以上方法都没有找到标题，尝试使用其他信息
              if (!pathTitle && path.userData?.style) {
                // 4. 尝试使用类名作为标题
                if (path.userData.node?.className?.baseVal) {
                  pathTitle = path.userData.node.className.baseVal;
                }
              }

              // 如果仍未找到标题，使用默认标题
              if (!pathTitle) {
                pathTitle = `形状 ${pathIndex + 1}`;
              }

              if (fillColor && fillColor !== "none") {
                // 使用自定义颜色替代原SVG颜色
                const material = new THREE.MeshPhongMaterial({
                  color: new THREE.Color(0x2196f3), // 使用蓝色作为主色
                  side: THREE.DoubleSide,
                  flatShading: true,
                  shininess: 100, // 增加光泽
                });

                const shapes = SVGLoader.createShapes(path);
                shapes.forEach((shape, shapeIndex) => {
                  const geometry = new THREE.ExtrudeGeometry(shape, {
                    depth: 0.3,
                    bevelEnabled: false,
                  });

                  const mesh = new THREE.Mesh(geometry, material);

                  // 中心化处理
                  mesh.position.x = -centerX * scale;
                  mesh.position.y = -centerY * scale;

                  // 缩放并反转Y轴
                  mesh.scale.set(scale, -scale, scale);

                  // 几乎不倾斜，让模型更正面朝向
                  mesh.rotation.x = -Math.PI * 0.01;
                  mesh.rotation.y = Math.PI * 0.01;

                  // 创建边框
                  const edgesGeometry = new THREE.EdgesGeometry(geometry);
                  const borderMaterial = new THREE.LineBasicMaterial({
                    color: 0x4fc3f7, // 亮蓝色边框
                    linewidth: 2,
                  });
                  const border = new THREE.LineSegments(
                    edgesGeometry,
                    borderMaterial
                  );

                  // 应用与模型相同的变换
                  border.position.copy(mesh.position);
                  border.rotation.copy(mesh.rotation);
                  border.scale.copy(mesh.scale);

                  // 略微偏移，避免z-fighting
                  border.position.z += 0.01;

                  // 为多形状的路径添加形状索引
                  const finalTitle =
                    shapes.length > 1
                      ? `${pathTitle} (${shapeIndex + 1}/${shapes.length})`
                      : pathTitle;

                  // 将网格和边框存储为一对，包含标题
                  interactiveModels.push({ mesh, border, title: finalTitle });

                  svgGroup.add(mesh);
                  svgGroup.add(border);
                });
              }

              if (strokeColor && strokeColor !== "none") {
                // 使用自定义颜色替代原SVG颜色
                const strokeMaterial = new THREE.LineBasicMaterial({
                  color: new THREE.Color(0x1565c0), // 深蓝色作为描边
                  linewidth: 2,
                });

                for (let j = 0; j < path.subPaths.length; j++) {
                  const subPath = path.subPaths[j];
                  const points = subPath.getPoints();
                  const geometry = new THREE.BufferGeometry().setFromPoints(
                    points
                  );
                  const line = new THREE.Line(geometry, strokeMaterial);

                  line.position.x = -centerX * scale;
                  line.position.y = -centerY * scale;
                  line.scale.set(scale, -scale, scale);
                  line.rotation.x = -Math.PI * 0.01;
                  line.rotation.y = Math.PI * 0.01;

                  svgGroup.add(line);
                }
              }
            });

            // 设置相机位置
            camera.position.set(0, 0, 5);
            camera.lookAt(0, 0, 0);

            // 在SVG加载后添加适当的控件配置
            const fitCameraToObject = (
              camera: THREE.PerspectiveCamera,
              object: THREE.Object3D,
              offset: number
            ) => {
              const boundingBox = new THREE.Box3();
              boundingBox.setFromObject(object);

              const center = boundingBox.getCenter(new THREE.Vector3());
              const size = boundingBox.getSize(new THREE.Vector3());

              // 获取最大尺寸，做一个小的调整让模型看起来更大
              const maxDim = Math.max(size.x, size.y, size.z) * 0.85;
              const fov = camera.fov * (Math.PI / 180);
              let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

              // 应用偏移
              cameraZ *= offset;

              camera.position.z = cameraZ;

              // 更新相机视锥
              const minZ = boundingBox.min.z;
              const cameraToFarEdge =
                minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

              camera.far = Math.max(1000, cameraToFarEdge * 3);
              camera.updateProjectionMatrix();

              // 让相机看向中心点
              camera.lookAt(center);
            };

            // 查找需要高亮的位置模型
            const highlightLocationModel = interactiveModels.find((model) => {
              if (!model.title || !highlightLocation) return false;
              const title = model.title.toLowerCase();
              const location = highlightLocation.toLowerCase();
              // 检查多种可能的名称格式
              return title.includes(location) || title === location;
            });

            // 如果有指定的高亮位置，优先使用，否则默认高亮湖北
            const targetModel =
              highlightLocationModel ||
              interactiveModels.find((model) => {
                if (!model.title) return false;
                const title = model.title.toLowerCase();
                // 检查多种可能的名称格式
                return (
                  title.includes("hubei") ||
                  title.includes("湖北") ||
                  title === "hubei" ||
                  title === "湖北"
                );
              });

            if (targetModel) {
              // 如果找到目标模型，让相机聚焦在它上面
              const targetMesh = targetModel.mesh;
              const boundingBox = new THREE.Box3().setFromObject(targetMesh);
              const center = boundingBox.getCenter(new THREE.Vector3());

              // 计算适当的相机距离
              const size = boundingBox.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z) * 2.5;
              const fov = camera.fov * (Math.PI / 180);
              const cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

              // 设置相机位置和朝向
              camera.position.z = cameraZ;

              // 应用偏移以确保目标在画布中心
              // 调整SVG组整体位置，使目标模型居中
              svgGroup.position.x = -center.x;
              svgGroup.position.y = -center.y;

              // 重新设置相机看向原点(0,0,0)而不是模型中心，因为我们已经移动了模型
              camera.lookAt(0, 0, 0);

              // 设置控制器的目标为原点
              if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();
              }

              // 高亮目标省份
              targetMesh.material = fixedHighlightMaterial;
              targetModel.border.material = fixedBorderHighlightMaterial;

              // 存储固定高亮的模型引用
              fixedHighlightedRef.current = {
                mesh: targetMesh,
                border: targetModel.border,
              };
            } else {
              // 如果没找到，则聚焦整个SVG组
              fitCameraToObject(camera, svgGroup, 1.2);
            }

            // 添加OrbitControls用于鼠标交互
            const controls = new OrbitControls(camera, renderer.domElement);
            // 基本设置
            controls.enableDamping = true; // 添加阻尼效果
            controls.dampingFactor = 0.1;
            controls.screenSpacePanning = true; // 屏幕空间平移
            controls.panSpeed = 0.8; // 平移速度
            controls.zoomSpeed = 1.2; // 缩放速度

            // 限制缩放范围
            controls.minDistance = 2; // 允许更近的缩放
            controls.maxDistance = 15;

            // 禁用不需要的功能
            controls.enableRotate = false; // 禁用旋转
            controls.autoRotate = false;

            // 限制平移范围，防止用户将SVG完全移出视野
            controls.maxPolarAngle = Math.PI / 2; // 限制上下平移
            controls.minPolarAngle = Math.PI / 2;

            // 应用初始设置
            controls.update();

            // 保存到引用中，供其他函数使用
            controlsRef.current = controls;
          },
          undefined,
          (error) => {
            console.error("Error loading SVG:", error);
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching SVG:", error);

        // 出错时仍尝试直接加载SVG
        loader.load(
          svgPath,
          () => {
            // 简化的错误恢复处理
            console.log("已跳过SVG标题提取，直接加载");
          },
          undefined,
          (error) => {
            console.error("Error loading SVG:", error);
          }
        );
      });

    // 鼠标移动处理函数
    const onMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;

      // 计算鼠标在归一化设备坐标中的位置
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      // 设置射线投射器
      raycaster.setFromCamera(mouse, camera);

      // 获取所有网格用于检测
      const meshes = interactiveModels.map((item) => item.mesh);

      // 检测与网格的相交
      const intersects = raycaster.intersectObjects(meshes, false);

      // 如果之前有鼠标悬停高亮对象（不是固定高亮的），恢复其原始材质
      if (
        highlightedMesh &&
        originalMaterial &&
        highlightedBorder &&
        highlightedMesh !== fixedHighlightedRef.current.mesh
      ) {
        highlightedMesh.material = originalMaterial;
        highlightedBorder.material = new THREE.LineBasicMaterial({
          color: 0x4fc3f7, // 恢复默认边框颜色
          linewidth: 2,
        });
        highlightedMesh = null;
        originalMaterial = null;
        highlightedBorder = null;
        // 隐藏提示框
        setTooltip((prev) => ({ ...prev, show: false }));
      }

      // 高亮鼠标悬停的模型
      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;

        // 找到对应的边框和标题
        const modelPair = interactiveModels.find((item) => item.mesh === mesh);

        if (modelPair) {
          // 如果鼠标悬停的不是固定高亮的模型，则应用悬停高亮
          if (modelPair.mesh !== fixedHighlightedRef.current.mesh) {
            highlightedMesh = modelPair.mesh;
            highlightedBorder = modelPair.border;
            originalMaterial = mesh.material as THREE.Material;

            // 高亮模型和边框
            highlightedMesh.material = highlightMaterial;
            highlightedBorder.material = borderHighlightMaterial;
          }

          // 显示标题提示框
          setTooltip({
            show: true,
            text: modelPair.title || "未命名模型",
            x: event.clientX,
            y: event.clientY,
          });

          // 添加鼠标指针样式
          if (mountRef.current) {
            mountRef.current.style.cursor = "pointer";
          }
        }
      } else {
        // 无交集时恢复默认指针
        if (mountRef.current) {
          mountRef.current.style.cursor = "default";
        }
      }
    };

    // 添加鼠标移动事件监听器
    mountRef.current.addEventListener("mousemove", onMouseMove);

    // 简单的动画效果
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update(); // 更新controls以实现阻尼效果
      }
      renderer.render(scene, camera);
    };

    animate();

    // 窗口大小变化处理
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.removeEventListener("mousemove", onMouseMove);
      }
      window.removeEventListener("resize", handleResize);

      // 清理controls
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      // 清理资源
      svgGroup.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, [width, height, svgPath, highlightLocation]);

  return (
    <div
      ref={mountRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {tooltip.show && (
        <div
          style={{
            position: "fixed",
            top: `${tooltip.y - 24}px`,
            left: `${tooltip.x - 60}px`,
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "14px",
            pointerEvents: "none", // 使提示框不阻止鼠标事件
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            maxWidth: "250px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-6px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "0",
              height: "0",
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: "6px solid rgba(0, 0, 0, 0.8)",
            }}
          />
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default ThreeSVG;
