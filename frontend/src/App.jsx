import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://real-time-robot-speedometer.onrender.com');

function App() {
  const [speed, setSpeed] = useState(0);
  const [time, setTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isDigital, setIsDigital] = useState(true);

  const [history, setHistory] = useState([
    30, 45, 38, 60, 55, 72, 64,
  ]);

  const runningRef = useRef(false);

  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    socket.on('speedUpdate', (data) => {
      console.log('Speed received:', data);

      if (!runningRef.current) return;

      setSpeed(data);

      setTime(new Date().toLocaleTimeString());

      setHistory((prev) => {
        const updated = [...prev, data];
        return updated.slice(-12);
      });
    });

    return () => {
      socket.off('speedUpdate');
    };
  }, []);

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '40px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#0f172a',
          }}
        >
          Real-Time Robot Speedometer
        </h1>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '40px',
          }}
        >
          <button
            onClick={() => setIsRunning(true)}
            style={{
              padding: '14px 24px',
              border: 'none',
              borderRadius: '10px',
              background: '#2563eb',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Start Monitoring
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSpeed(0);
            }}
            style={{
              padding: '14px 24px',
              border: 'none',
              borderRadius: '10px',
              background: '#ef4444',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Stop
          </button>

          <button
            onClick={() => setIsDigital(!isDigital)}
            style={{
              padding: '14px 24px',
              border: 'none',
              borderRadius: '10px',
              background: '#0f766e',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {isDigital ? 'Analog Mode' : 'Digital Mode'}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: '#081226',
              border: `14px solid ${getColor()}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              boxShadow: `0 0 30px ${getColor()}55`,
              transition: '0.4s',
              position: 'relative',
            }}
          >
            {isDigital ? (
              <>
                <div
                  style={{
                    fontSize: '90px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {speed}
                </div>

                <div
                  style={{
                    color: '#cbd5e1',
                    fontSize: '30px',
                  }}
                >
                  km/h
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    color: getColor(),
                    fontSize: '34px',
                    fontWeight: 'bold',
                  }}
                >
                  {getStatus()}
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    position: 'absolute',
                    width: '5px',
                    height: '35%',
                    background: '#facc15',
                    bottom: '50%',
                    borderRadius: '20px',
                    transform: `rotate(${speed * 1.8 - 90}deg)`,
                    transformOrigin: 'bottom center',
                    transition: '0.4s',
                  }}
                />

                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#facc15',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '50px',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {speed}
                  </div>

                  <div
                    style={{
                      color: '#cbd5e1',
                    }}
                  >
                    km/h
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          <h2
            style={{
              color: getColor(),
            }}
          >
            {getStatus()}
          </h2>

          <p
            style={{
              color: '#475569',
              fontSize: '18px',
            }}
          >
            Last Updated: {time}
          </p>
        </div>

        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '20px',
          }}
        >
          <h2
            style={{
              marginBottom: '20px',
              color: '#0f172a',
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
                  borderRadius: '10px 10px 0 0',
                  background:
                    'linear-gradient(180deg,#2dd4bf,#0f766e)',
                  height: `${item * 2}px`,
                  transition: '0.4s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;