import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ThreeSVGProps {
  width?: number;
  height?: number;
  svgPath: string;
}

const ThreeSVG: React.FC<ThreeSVGProps> = ({
  width = 200,
  height = 200,
  svgPath,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

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
    }[] = [];

    // 加载SVG
    const loader = new SVGLoader();
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

        paths.forEach((path) => {
          const fillColor = path.userData?.style.fill;
          const strokeColor = path.userData?.style.stroke;

          if (fillColor && fillColor !== "none") {
            // 使用自定义颜色替代原SVG颜色
            const material = new THREE.MeshPhongMaterial({
              color: new THREE.Color(0x2196f3), // 使用蓝色作为主色
              side: THREE.DoubleSide,
              flatShading: true,
              shininess: 100, // 增加光泽
            });

            const shapes = SVGLoader.createShapes(path);
            shapes.forEach((shape) => {
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

              // 将网格和边框存储为一对
              interactiveModels.push({ mesh, border });

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
              const geometry = new THREE.BufferGeometry().setFromPoints(points);
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
          const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

          camera.far = Math.max(1000, cameraToFarEdge * 3);
          camera.updateProjectionMatrix();

          // 让相机看向中心点
          camera.lookAt(center);
        };

        fitCameraToObject(camera, svgGroup, 1.2);

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

      // 如果之前有高亮对象，恢复其原始材质
      if (highlightedMesh && originalMaterial && highlightedBorder) {
        highlightedMesh.material = originalMaterial;
        highlightedBorder.material = new THREE.LineBasicMaterial({
          color: 0x4fc3f7, // 恢复默认边框颜色
          linewidth: 2,
        });
        highlightedMesh = null;
        originalMaterial = null;
        highlightedBorder = null;
      }

      // 高亮鼠标悬停的模型
      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;

        // 找到对应的边框
        const modelPair = interactiveModels.find((item) => item.mesh === mesh);

        if (modelPair) {
          highlightedMesh = modelPair.mesh;
          highlightedBorder = modelPair.border;
          originalMaterial = mesh.material as THREE.Material;

          // 高亮模型和边框
          highlightedMesh.material = highlightMaterial;
          highlightedBorder.material = borderHighlightMaterial;

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
  }, [width, height, svgPath]);

  return (
    <div
      ref={mountRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: "0 auto",
      }}
    />
  );
};

export default ThreeSVG;
