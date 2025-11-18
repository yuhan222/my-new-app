import { useEffect, useState } from "react";

function FooterWeather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Taipei");

  useEffect(() => {
    fetch(`https://wttr.in/${city}?format=j1`)
      .then(res => res.json())
      .then(data => {
        const w = data.current_condition[0];
        setWeather({
          city: data.nearest_area[0].areaName[0].value,
          temp: w.temp_C,
          desc: w.weatherDesc[0]?.value,
          humidity: w.humidity,
          wind: w.windspeedKmph
        });
      })
      .catch(() => setWeather(null));
  }, [city]);

  // ⭐ 根據天氣狀態判斷 emoji 圖示
  const getWeatherIcon = (desc) => {
    if (!desc) return "🌤";
    if (desc.includes("rain") || desc.includes("雨")) return "🌧";
    if (desc.includes("cloud") || desc.includes("陰")) return "⛅";
    if (desc.includes("sunny") || desc.includes("晴")) return "☀️";
    if (desc.includes("snow") || desc.includes("雪")) return "❄️";
    return "🌤";
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🌤 今日天氣查詢</h3>

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={styles.selectBox}
      >
        <option value="Taipei">台北</option>
        <option value="Kaohsiung">高雄</option>
        <option value="Taichung">台中</option>
        <option value="Tainan">台南</option>
        <option value="Tokyo">東京</option>
        <option value="Seoul">首爾</option>
        <option value="HongKong">香港</option>
        <option value="Bangkok">曼谷</option>
        <option value="Singapore">新加坡</option>
        <option value="NewYork">紐約</option>
        <option value="London">倫敦</option>
        <option value="Paris">巴黎</option>
      </select>

      {weather ? (
        <div style={styles.card}>
          <h2 style={styles.city}>{weather.city}</h2>
          <div style={styles.iconTemp}>
            <span style={styles.weatherIcon}>{getWeatherIcon(weather.desc)}</span>
            <span style={styles.temp}>{weather.temp}°C</span>
          </div>
          <p style={styles.desc}>{weather.desc}</p>

          <div style={styles.infoRow}>
            <span>💧 濕度：{weather.humidity}%</span>
            <span>🌬 風速：{weather.wind} km/h</span>
          </div>
        </div>
      ) : (
        <p style={{ color: "#ff4d4d" }}>⚠ 無法取得天氣資料</p>
      )}
    </div>
  );
}

// 🎨 美化樣式
const styles = {
  container: {
    marginTop: "50px",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#1e3a8a",
  },
  selectBox: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #bbb",
    marginBottom: "15px",
    width: "200px",
    fontSize: "15px",
    outline: "none",
    cursor: "pointer",
  },
  card: {
    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    padding: "25px",
    borderRadius: "16px",
    maxWidth: "360px",
    margin: "auto",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    color: "#1e3a8a",
  },
  city: {
    fontSize: "22px",
    margin: 0,
    fontWeight: "700",
  },
  iconTemp: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  },
  weatherIcon: {
    fontSize: "42px",
  },
  temp: {
    fontSize: "32px",
    fontWeight: "700",
  },
  desc: {
    margin: "8px 0",
    fontSize: "16px",
    fontWeight: "500",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "14px",
    padding: "0 20px",
  },
};

export default FooterWeather;
