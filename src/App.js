import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";

function App() {

  // 🌤 天氣 state
  const [weather, setWeather] = useState(null);

  // 🔎 自動抓取台北天氣
  useEffect(() => {
    fetch("https://wttr.in/Taipei?format=j1")
      .then(res => res.json())
      .then(data => {
        const w = data.current_condition[0];
        setWeather({
          city: data.nearest_area[0].areaName[0].value,
          temp: w.temp_C,
          desc: w.weatherDesc[0].value,
          humidity: w.humidity,
          wind: w.windspeedKmph
        });
      })
      .catch(() => setWeather(null));
  }, []);

  return (
    <div className="App">

      {/* ⬆️ 保留你的原本內容，不動 */}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      {/* ⬇️ 新增天氣區塊（獨立、放底部） */}
      <div style={styles.weatherBox}>
        {weather ? (
          <>
            <h3>📍 今日 {weather.city} 天氣</h3>
            <p>🌤 狀態：{weather.desc}</p>
            <p>🌡 溫度：{weather.temp}°C</p>
            <p>💧 濕度：{weather.humidity}%</p>
            <p>🌬 風速：{weather.wind} km/h</p>
          </>
        ) : (
          <p>⚠ 無法取得天氣資料</p>
        )}
      </div>

    </div>
  );
}

// 🎨 天氣樣式
const styles = {
  weatherBox: {
    marginTop: '40px',
    marginBottom: '30px',
    padding: '20px',
    maxWidth: '380px',
    margin: '40px auto',
    background: '#f0f4ff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    color: '#1e3a8a',
    lineHeight: '1.8',
    textAlign: 'center',
  },
};

export default App;
