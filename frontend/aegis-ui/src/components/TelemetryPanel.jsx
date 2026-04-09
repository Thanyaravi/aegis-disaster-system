import React from "react";
import "./TelemetryPanel.css";

export default function TelemetryPanel({ drones = [], detections = [] }) {
  const getStatusColor = (status) => {
    return {
      idle: "#00d9ff",
      enroute: "#ffaa00",
      active: "#ff0055",
      rtb: "#00ff88",
    }[status] || "#888";
  };

  const getTotalDistance = (drone) => {
    if (!drone.path) return 0;
    return drone.path.length;
  };

  const getTargetCount = () => {
    return detections.filter((d) => d.type !== "person").length;
  };

  const getFireCount = () => {
    return detections.filter((d) => d.type === "fire").length;
  };

  const getFloodCount = () => {
    return detections.filter((d) => d.type === "flood").length;
  };

  const getCollapseCount = () => {
    return detections.filter((d) => d.type === "collapse").length;
  };

  return (
    <div className="telemetry-panel">
      <div className="panel-header">📡 TELEMETRY SYSTEM</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">ACTIVE DRONES</div>
          <div className="stat-value">{drones.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">TARGET COUNT</div>
          <div className="stat-value">{getTargetCount()}</div>
        </div>
        <div className="stat-card alert">
          <div className="stat-label">🔥 FIRES</div>
          <div className="stat-value">{getFireCount()}</div>
        </div>
        <div className="stat-card alert">
          <div className="stat-label">💧 FLOODS</div>
          <div className="stat-value">{getFloodCount()}</div>
        </div>
      </div>

      <div className="drones-list">
        <div className="list-header">DRONE STATUS</div>
        {drones.length === 0 ? (
          <div className="empty-state">No drones connected</div>
        ) : (
          drones.map((drone) => (
            <div key={drone.id} className="drone-item">
              <div className="drone-id">
                <span className="status-indicator" style={{ backgroundColor: getStatusColor(drone.status) }}></span>
                DRONE-{String(drone.id).padStart(2, "0")}
              </div>
              <div className="drone-info">
                <div className="info-row">
                  <span className="label">Position:</span>
                  <span className="value">[{drone.pos[0]}, {drone.pos[1]}]</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value">{drone.status.toUpperCase()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Distance:</span>
                  <span className="value">{getTotalDistance(drone)} units</span>
                </div>
                {drone.target !== null && (
                  <div className="info-row target">
                    <span className="label">Target:</span>
                    <span className="value">#{drone.target}</span>
                  </div>
                )}
              </div>
              <div className="status-bar">
                <div className="bar-fill" style={{ width: `${(drone.pos[0] / 9) * 100}%` }}></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
