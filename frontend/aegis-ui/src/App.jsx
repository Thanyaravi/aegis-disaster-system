import { useEffect, useState, useRef } from "react";
import RadarComponent from "./components/RadarComponent";
import TelemetryPanel from "./components/TelemetryPanel";
import AlertSystem from "./components/AlertSystem";
import "./App.css";

// Get API URLs from environment or use defaults
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastAlert, setLastAlert] = useState(null);
  const appRef = useRef(null);
  const audioContextRef = useRef(null);

  // Play emergency sound
  const playEmergencySound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      // Create oscillator for alarm sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.log("Audio not available");
    }
  };

  // WebSocket connection with auto-reconnect
  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;

    const connectWebSocket = () => {
      try {
        ws = new WebSocket(`${WS_URL}/ws`);

        ws.onopen = () => {
          console.log("✅ WebSocket connected");
          setWsConnected(true);
          setConnectionAttempts(0);
          setLoading(false);
          ws.send("ping");
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === "pong") {
              // Periodic ping response
            } else {
              setData(message);
              // Trigger emergency effects
              if (message.alert && message.alert !== lastAlert) {
                if (["FIRE", "FLOOD", "COLLAPSE", "EMERGENCY"].includes(message.alert)) {
                  playEmergencySound();
                  setLastAlert(message.alert);
                }
              }
            }
          } catch (e) {
            console.error("Error parsing WebSocket message:", e);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          setWsConnected(false);
        };

        ws.onclose = () => {
          console.log("⚠️ WebSocket disconnected");
          setWsConnected(false);
          const delay = Math.min(1000 * Math.pow(1.5, connectionAttempts), 30000);
          setConnectionAttempts((prev) => prev + 1);
          reconnectTimeout = setTimeout(connectWebSocket, delay);
        };
      } catch (error) {
        console.error("❌ Failed to create WebSocket:", error);
        setWsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  // Fallback HTTP polling if WebSocket fails
  useEffect(() => {
    if (wsConnected) return;

    const interval = setInterval(() => {
      fetch(`${API_URL}/state`)
        .then((res) => res.json())
        .then((newData) => {
          setData(newData);
          setLoading(false);
          // Trigger emergency effects
          if (newData.alert && newData.alert !== lastAlert) {
            if (["FIRE", "FLOOD", "COLLAPSE", "EMERGENCY"].includes(newData.alert)) {
              playEmergencySound();
              setLastAlert(newData.alert);
            }
          }
        })
        .catch((err) => console.error("HTTP polling error:", err));
    }, 200);

    return () => clearInterval(interval);
  }, [wsConnected, lastAlert]);

  // Handle grid click for SOS
  const handleSOS = (x, y) => {
    const sosData = { pos: [x, y] };

    // Play sound immediately on click
    playEmergencySound();

    if (wsConnected) {
      const ws = new WebSocket(`${WS_URL}/ws`);
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "sos", pos: [x, y] }));
        ws.close();
      };
    } else {
      fetch(`${API_URL}/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sosData),
      }).catch((err) => console.error("SOS error:", err));
    }
  };

  const handleRadarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / 10));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / 10));

    const gridX = Math.max(0, Math.min(9, x));
    const gridY = Math.max(0, Math.min(9, y));

    handleSOS(gridX, gridY);
  };

  if (loading) {
    return (
      <div className="boot-screen">
        <div className="boot-content">
          <div className="boot-logo">⚡</div>
          <h1>AEGIS SYSTEM</h1>
          <p>Autonomous Emergency Grid Intelligence System</p>
          <div className="boot-spinner">
            <div className="spinner"></div>
          </div>
          <p className="boot-status">Initializing neural network...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h1>❌ CONNECTION ERROR</h1>
          <p>Unable to connect to AEGIS backend</p>
          <p className="error-hint">Ensure backend is running on http://localhost:8000</p>
        </div>
      </div>
    );
  }

  const isEmergency = ["FIRE", "FLOOD", "COLLAPSE", "EMERGENCY"].includes(data.alert);

  return (
    <div
      ref={appRef}
      className={`app ${isEmergency ? "emergency" : ""}`}
    >
      {/* TOP HEADER */}
      <div className="app-header">
        <div className="header-left">
          <div className="logo">⚡ AEGIS</div>
          <div className="title">Disaster Response Network</div>
        </div>
        <div className="header-center">
          <div className={`status-badge ${wsConnected ? "connected" : "polling"}`}>
            {wsConnected ? "🔵 LIVE" : "🟡 POLLING"} | Step: {data.step || 0}
          </div>
        </div>
        <div className="header-right">
          <div className="info-badge">
            🚁 {data.drones?.length || 0} DRONES | 🎯 {data.detections?.length || 0} TARGETS
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="app-main">
        {/* LEFT PANEL */}
        <div className="panel left-panel">
          <AlertSystem alert={data.alert} events={data.events || []} />
        </div>

        {/* CENTER RADAR */}
        <div className="center-section">
          <div className="radar-wrapper" onClick={handleRadarClick}>
            <RadarComponent
              drones={data.drones || []}
              detections={data.detections || []}
            />
            <div className="radar-overlay-hint">Click to deploy SOS</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel right-panel">
          <TelemetryPanel drones={data.drones || []} detections={data.detections || []} />
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="app-footer">
        <div className="footer-left">
          <span>⌨️ Press to interact | 🖱️ Click radar for SOS</span>
        </div>
        <div className="footer-center">
          <span className="timestamp">
            {data.timestamp
              ? new Date(data.timestamp).toLocaleTimeString()
              : "-- : -- : --"}
          </span>
        </div>
        <div className="footer-right">
          <span>{data.simulation_status?.toUpperCase() || "IDLE"}</span>
        </div>
      </div>
    </div>
  );
}