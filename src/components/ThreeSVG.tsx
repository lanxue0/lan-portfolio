import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

        // 遍历所有路径前先创建边框几何体集合
        const borderGeometries: THREE.BufferGeometry[] = [];

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

              // 保存几何体用于边框
              borderGeometries.push(geometry.clone());

              const mesh = new THREE.Mesh(geometry, material);

              // 中心化处理
              mesh.position.x = -centerX * scale;
              mesh.position.y = -centerY * scale;

              // 缩放并反转Y轴
              mesh.scale.set(scale, -scale, scale);

              // 几乎不倾斜，让模型更正面朝向
              mesh.rotation.x = -Math.PI * 0.01;
              mesh.rotation.y = Math.PI * 0.01;

              svgGroup.add(mesh);
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

        // 添加边框效果
        if (borderGeometries.length > 0) {
          // 合并所有几何体
          const mergeGeometry =
            BufferGeometryUtils.mergeGeometries(borderGeometries);

          if (mergeGeometry) {
            const edges = new THREE.EdgesGeometry(mergeGeometry);
            const borderMaterial = new THREE.LineBasicMaterial({
              color: 0x4fc3f7, // 亮蓝色边框
              linewidth: 2,
            });

            const borderLine = new THREE.LineSegments(edges, borderMaterial);

            // 应用与模型相同的变换
            borderLine.position.x = -centerX * scale;
            borderLine.position.y = -centerY * scale;
            borderLine.scale.set(scale, -scale, scale);
            borderLine.rotation.x = -Math.PI * 0.01;
            borderLine.rotation.y = Math.PI * 0.01;

            // 略微偏移，避免z-fighting
            borderLine.position.z = 0.01;

            svgGroup.add(borderLine);
          }
        }

        // 设置相机位置
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);

        // 在SVG加载和处理完毕后，执行自动适应布局
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

        fitCameraToObject(camera, svgGroup, 1.0);
      },
      undefined,
      (error) => {
        console.error("Error loading SVG:", error);
      }
    );

    // 简单的动画效果
    const animate = () => {
      requestAnimationFrame(animate);
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
      }
      window.removeEventListener("resize", handleResize);

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
