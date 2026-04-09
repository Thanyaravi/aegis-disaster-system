import React, { useEffect, useState } from "react";
import "./AlertSystem.css";

export default function AlertSystem({ alert, events = [] }) {
  const [blinkState, setBlinkState] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
    const icons = {
      FIRE: "🔥",
      FLOOD: "💧",
      COLLAPSE: "⚠️",
      EMERGENCY: "🚨",
    };
    return icons[type] || "⚠️";
  };

  const getAlertClass = (type) => {
    if (!type) return "safe";
    return type.toLowerCase();
  };

  const isEmergencyEvent = (event) => {
    return event && event.includes("🚨");
  };

  return (
    <div className={`alert-system ${getAlertClass(alert)}`}>
      <div className={`alert-banner ${blinkState ? "blink" : ""}`}>
        <div className="alert-icon">{getAlertIcon(alert)}</div>
        <div className="alert-content">
          <div className="alert-status">{alert || "SYSTEM STABLE"}</div>
          <div className="alert-description">
            {alert
              ? `⚠️ CRITICAL INCIDENT DETECTED - DRONE RESPONSE INITIATED`
              : "✅ All systems nominal"}
          </div>
        </div>
      </div>

      <div className="event-log">
        <div className="log-header">📋 EVENT LOG - REAL-TIME</div>
        <div className="log-content">
          {events.length === 0 ? (
            <div className="log-empty">Awaiting events...</div>
          ) : (
            events
              .slice()
              .reverse()
              .map((event, idx) => (
                <div
                  key={idx}
                  className={`log-entry ${isEmergencyEvent(event) ? "emergency" : ""}`}
                >
                  <span className="log-time">{`[${idx + 1}]`}</span>
                  <span className="log-text">{event}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
