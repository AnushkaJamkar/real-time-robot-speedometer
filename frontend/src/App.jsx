import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://real-time-robot-speedometer.onrender.com');

function App() {
  const [speed, setSpeed] = useState(0);
  const [time, setTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isDigital, setIsDigital] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  const [history, setHistory] = useState([
    30, 45, 38, 60, 55, 72, 64,
  ]);

  useEffect(() => {
    socket.on('speedUpdate', (data) => {
      if (isRunning) {
        setSpeed(data);
        setTime(new Date().toLocaleTimeString());

        setHistory((prev) => {
          const updated = [...prev, data];
          return updated.slice(-12);
        });
      }
    });

    return () => {
      socket.off('speedUpdate');
    };
  }, [isRunning]);

  const getStatus = () => {
    if (speed < 40) return 'LOW';
    if (speed < 80) return 'MEDIUM';
    return 'HIGH';
  };

  const getColor = () => {
    if (speed < 40) return '#14b8a6';
    if (speed < 80) return '#eab308';
    return '#ef4444';
  };

  const getMessage = () => {
    if (speed < 40) return 'Robot Operating Smoothly';
    if (speed < 80) return 'Normal Warehouse Movement';
    return 'High Speed Movement';
  };

  const navItems = [
    { label: 'Dashboard', id: 'dashboard' },
    { label: 'Analytics', id: 'analytics' },
    { label: 'Containers', id: 'containers' },
    { label: 'Monitoring', id: 'monitoring' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #edf2f7 0%, #f8fafc 45%, #e2e8f0 100%)',
        padding: '24px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* NAVBAR */}

        <div
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '18px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '18px',
            marginBottom: '26px',
            boxShadow: '0 8px 30px rgba(15,23,42,0.06)',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '800',
              color: '#0f172a',
            }}
          >
            Unbox Speedometer
          </h1>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);

                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({
                      behavior: 'smooth',
                    });
                }}
                style={{
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border:
                    activeNav === item.id
                      ? 'none'
                      : '1px solid #dbe4ee',

                  background:
                    activeNav === item.id
                      ? '#14b8a6'
                      : 'transparent',

                  color:
                    activeNav === item.id
                      ? 'white'
                      : '#475569',

                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: '0.3s ease',

                  boxShadow:
                    activeNav === item.id
                      ? '0 10px 20px rgba(20,184,166,0.2)'
                      : 'none',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* HERO */}

        <div
          id="dashboard"
          style={{
            background: 'rgba(255,255,255,0.68)',
            borderRadius: '34px',
            padding: '28px 32px',
            boxShadow: '0 15px 50px rgba(15,23,42,0.06)',
            marginBottom: '28px',
            overflow: 'hidden',
          }}
        >
          {/* TOP TEXT */}

          <div
            style={{
              textAlign: 'center',
              marginBottom: '34px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: '#d1fae5',
                color: '#047857',
                padding: '10px 22px',
                borderRadius: '999px',
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '24px',
              }}
            >
              ● Live Robot Stream
            </div>

            <h2
              style={{
                fontSize: 'clamp(34px, 5vw, 58px)',
                lineHeight: '1.1',
                color: '#0f172a',
                marginBottom: '20px',
                fontWeight: '800',
              }}
            >
              Real-Time Robot
              <br />
              Speedometer
            </h2>

            <p
              style={{
                maxWidth: '760px',
                margin: '0 auto',
                color: '#64748b',
                fontSize: '20px',
                lineHeight: '1.8',
              }}
            >
              Live telemetry dashboard simulating warehouse robot
              movement using React, Socket.IO, PostgreSQL and
              Docker containers.
            </p>
          </div>

          {/* BUTTONS */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '40px',
            }}
          >
            <button
              onClick={() => setIsRunning(true)}
              style={buttonStyle('#2563eb')}
            >
              Start Monitoring
            </button>

            <button
              onClick={() => setIsRunning(false)}
              style={buttonStyle('#ef4444')}
            >
              Stop
            </button>

            <button
              onClick={() => setIsDigital(!isDigital)}
              style={buttonStyle('#0f766e')}
            >
              {isDigital ? 'Analog Mode' : 'Digital Mode'}
            </button>
          </div>

          {/* GRID */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '22px',
              alignItems: 'start',
            }}
          >
            {/* LEFT */}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* SPEEDOMETER */}

              <div
                style={{
                  width: 'clamp(260px, 30vw, 390px)',
                  height: 'clamp(260px, 30vw, 390px)',
                  borderRadius: '50%',
                  background: '#081226',
                  border: `16px solid ${getColor()}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  boxShadow: `0 0 40px ${getColor()}35`,
                  transition: '0.4s ease',
                }}
              >
                {isDigital ? (
                  <div
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'clamp(72px, 8vw, 95px)',
                        fontWeight: '800',
                        color: 'white',
                        lineHeight: 1,
                      }}
                    >
                      {speed}
                    </div>

                    <div
                      style={{
                        fontSize: 'clamp(24px, 3vw, 32px)',
                        color: '#cbd5e1',
                        marginTop: '8px',
                      }}
                    >
                      km/h
                    </div>

                    <div
                      style={{
                        marginTop: '18px',
                        fontSize: 'clamp(30px,4vw,42px)',
                        fontWeight: '700',
                        color: getColor(),
                      }}
                    >
                      {getStatus()}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: '72%',
                        height: '72%',
                        borderRadius: '50%',
                        border: '6px dashed #facc15',
                        position: 'absolute',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        width: '5px',
                        height: '34%',
                        background: '#facc15',
                        bottom: '50%',
                        borderRadius: '20px',
                        transform: `rotate(${speed * 1.8 - 90}deg)`,
                        transformOrigin: 'bottom center',
                        transition: '0.5s ease',
                      }}
                    />

                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#facc15',
                        zIndex: 2,
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '52px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '54px',
                          color: 'white',
                          fontWeight: '700',
                        }}
                      >
                        {speed}
                      </div>

                      <div
                        style={{
                          color: '#cbd5e1',
                          fontSize: '22px',
                        }}
                      >
                        km/h
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* STATUS */}

              <div
                style={{
                  marginTop: '26px',
                  background: 'white',
                  color: getColor(),
                  padding: '16px 28px',
                  borderRadius: '16px',
                  fontWeight: '700',
                  fontSize: '22px',
                  boxShadow:
                    '0 10px 30px rgba(15,23,42,0.08)',
                }}
              >
                {getMessage()}
              </div>
            </div>

            {/* RIGHT */}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '22px',
              }}
            >
              {/* SYSTEM STATUS */}

              <div
                id="containers"
                style={cardStyle}
              >
                <h2
                  style={{
                    fontSize: '42px',
                    color: '#0f172a',
                    marginBottom: '26px',
                  }}
                >
                  System Status
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    color: '#334155',
                    fontSize: '20px',
                  }}
                >
                  <div>🟢 Database Connected</div>
                  <div>🟢 Socket.IO Active</div>
                  <div>🟢 Docker Running</div>
                  <div>🟢 Update Interval: 1 sec</div>
                </div>
              </div>

              {/* LIVE METRICS */}

              <div
                id="monitoring"
                style={cardStyle}
              >
                <h2
                  style={{
                    fontSize: '42px',
                    color: '#0f172a',
                    marginBottom: '26px',
                  }}
                >
                  Live Metrics
                </h2>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <MetricCard
                    title="Current Speed"
                    value={`${speed} km/h`}
                  />

                  <MetricCard
                    title="Status"
                    value={getStatus()}
                  />

                  <MetricCard
                    title="Latency"
                    value="24ms"
                  />

                  <MetricCard
                    title="Packets"
                    value="1,284"
                  />
                </div>

                <div
                  style={{
                    marginTop: '24px',
                    color: '#64748b',
                    textAlign: 'center',
                    fontSize: '17px',
                  }}
                >
                  Last Updated: {time}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHART */}

        <div
          id="analytics"
          style={{
            ...cardStyle,
            marginBottom: '28px',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              fontSize: '40px',
              color: '#0f172a',
              marginBottom: '34px',
            }}
          >
            Live Speed Trend
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px',
              height: '220px',
            }}
          >
            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  borderRadius: '12px 12px 0 0',
                  background:
                    'linear-gradient(180deg,#2dd4bf,#0f766e)',
                  height: `${item * 2}px`,
                  transition: '0.5s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* ABOUT */}

        <div
          style={{
            ...cardStyle,
            marginBottom: '26px',
          }}
        >
          <h2
            style={{
              fontSize: '40px',
              color: '#0f172a',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            About This Dashboard
          </h2>

          <p
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              color: '#475569',
              fontSize: '19px',
              lineHeight: '2',
              textAlign: 'center',
            }}
          >
            This dashboard simulates a warehouse robot
            speed monitoring system where robots continuously
            stream live telemetry data to a backend server.
            React handles the dynamic frontend visualization,
            while Socket.IO enables real-time communication.
            The speedometer and analytics graph update
            continuously to represent robot movement
            inside a smart warehouse environment.
          </p>
        </div>

        {/* FOOTER */}

        <div
          style={{
            textAlign: 'center',
            color: '#64748b',
            paddingBottom: '26px',
            fontSize: '16px',
          }}
        >
          Powered by React • Socket.IO • PostgreSQL • Docker
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div
      style={{
        background: 'rgba(248,250,252,0.9)',
        borderRadius: '18px',
        padding: '24px',
        textAlign: 'center',
        border: '1px solid rgba(148,163,184,0.12)',
      }}
    >
      <div
        style={{
          color: '#64748b',
          fontSize: '16px',
          marginBottom: '10px',
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#0f172a',
        }}
      >
        {value}
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'rgba(255,255,255,0.7)',
  borderRadius: '28px',
  padding: '26px',
  boxShadow: '0 15px 40px rgba(15,23,42,0.06)',
};

const buttonStyle = (bg) => ({
  background: bg,
  color: 'white',
  border: 'none',
  padding: '15px 26px',
  borderRadius: '14px',
  fontSize: '17px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 10px 22px rgba(15,23,42,0.12)',
});

export default App;