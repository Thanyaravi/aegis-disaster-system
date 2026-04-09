import React, { useEffect, useRef } from "react";
import "./RadarComponent.css";

export default function RadarComponent({ drones, detections, gridSize = 10, cellSize = 40 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "rgba(5, 15, 25, 0.95)";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "rgba(0, 255, 230, 0.15)";
    ctx.lineWidth = 0.5;
    const cellPixels = width / gridSize;

    for (let i = 0; i <= gridSize; i++) {
      const pos = (i / gridSize) * width;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(width, pos);
      ctx.stroke();
    }

    // Draw scan effect
    const time = Date.now() / 1000;
    const scanAngle = (time % 2) * Math.PI;
    const scanRadius = width / 2;

    ctx.strokeStyle = "rgba(0, 255, 230, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, scanRadius, scanAngle, scanAngle + Math.PI / 3);
    ctx.stroke();

    // Draw detections (heat zones)
    if (detections && detections.length > 0) {
      detections.forEach((det) => {
        const x = (det.pos[0] / gridSize) * width;
        const y = (det.pos[1] / gridSize) * height;

        // Color based on type
        const colors = {
          fire: "rgba(255, 50, 50, 0.8)",
          flood: "rgba(50, 150, 255, 0.8)",
          collapse: "rgba(255, 165, 0, 0.8)",
          person: "rgba(50, 255, 50, 0.8)",
        };

        ctx.fillStyle = colors[det.type] || "rgba(255, 255, 0, 0.8)";

        // Pulse effect
        const pulse = Math.sin(time * 3) * 0.3 + 0.7;
        const radius = 12 * pulse;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = colors[det.type] || "rgba(255, 255, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    // Draw drone paths
    if (drones && drones.length > 0) {
      drones.forEach((drone, idx) => {
        if (drone.path && drone.path.length > 0) {
          ctx.strokeStyle = "rgba(0, 255, 230, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();

          const startX = (drone.pos[0] / gridSize) * width;
          const startY = (drone.pos[1] / gridSize) * height;
          ctx.moveTo(startX, startY);

          drone.path.forEach((point) => {
            const px = (point[0] / gridSize) * width;
            const py = (point[1] / gridSize) * height;
            ctx.lineTo(px, py);
          });

          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    // Draw drones
    if (drones && drones.length > 0) {
      drones.forEach((drone, idx) => {
        const x = (drone.pos[0] / gridSize) * width;
        const y = (drone.pos[1] / gridSize) * height;

        // Drone glow
        ctx.fillStyle = "rgba(0, 255, 230, 0.3)";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Drone body
        ctx.fillStyle = "rgb(0, 255, 230)";
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Drone number label
        ctx.fillStyle = "#050f19";
        ctx.font = "bold 10px 'Courier New'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(drone.id), x, y);
      });
    }

    // Draw border
    ctx.strokeStyle = "rgba(0, 255, 230, 0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
  }, [drones, detections, gridSize]);

  return (
    <div className="radar-component">
      <canvas ref={canvasRef} width={500} height={500} className="radar-canvas" />
    </div>
  );
}
