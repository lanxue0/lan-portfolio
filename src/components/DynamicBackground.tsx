import React, { useRef, useEffect, useState } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface DynamicBackgroundProps {
  pointsCount?: number;
  lineDistance?: number;
  pointRadius?: number;
  speed?: number;
}

// 初始参数，点数量，连线距离，点半径，速度
const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  pointsCount = 50,
  lineDistance = 150,
  pointRadius = 2,
  speed = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [mouse, setMouse] = useState<{ x: number; y: number; active: boolean }>(
    {
      x: 0,
      y: 0,
      active: false,
    }
  );
  const animationRef = useRef<number | null>(null);

  // 初始化点
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 重置canvas和点
    const resizeCanvas = () => {
      // 设置Canvas大小为窗口大小
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 重新创建点
      const newPoints: Point[] = [];
      for (let i = 0; i < pointsCount; i++) {
        newPoints.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * pointRadius + 1,
          color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`,
        });
      }
      setPoints(newPoints);
    };

    resizeCanvas();
    // 监听窗口变化
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pointsCount, pointRadius, speed]);

  // 动画效果
  useEffect(() => {
    if (!canvasRef.current || points.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新点的位置
      const updatedPoints = [...points].map((point) => {
        // 正常移动
        let newX = point.x + point.vx;
        let newY = point.y + point.vy;

        // 碰到边界情况
        if (newX < 0 || newX > canvas.width) {
          point.vx = -point.vx;
          newX = point.x + point.vx;
        }
        if (newY < 0 || newY > canvas.height) {
          point.vy = -point.vy;
          newY = point.y + point.vy;
        }

        // 鼠标拖拽效果
        if (mouse.active) {
          const dx = mouse.x - newX;
          const dy = mouse.y - newY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < lineDistance) {
            const forceX = (dx / distance) * 0.8;
            const forceY = (dy / distance) * 0.8;
            newX += forceX;
            newY += forceY;
          }
        }

        return {
          ...point,
          x: newX,
          y: newY,
        };
      });

      setPoints(updatedPoints);

      // 绘制点
      updatedPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();
      });

      // 绘制连线
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < updatedPoints.length; i++) {
        for (let j = i + 1; j < updatedPoints.length; j++) {
          const dx = updatedPoints[i].x - updatedPoints[j].x;
          const dy = updatedPoints[i].y - updatedPoints[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < lineDistance) {
            ctx.beginPath();
            ctx.moveTo(updatedPoints[i].x, updatedPoints[i].y);
            ctx.lineTo(updatedPoints[j].x, updatedPoints[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [points, mouse, lineDistance]);

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouse({
      x: e.clientX,
      y: e.clientY,
      active: true,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouse.active) {
      setMouse({
        x: e.clientX,
        y: e.clientY,
        active: true,
      });
    }
  };

  const handleMouseUp = () => {
    setMouse((prev) => ({
      ...prev,
      active: false,
    }));
  };

  const handleMouseLeave = () => {
    setMouse((prev) => ({
      ...prev,
      active: false,
    }));
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default DynamicBackground;
