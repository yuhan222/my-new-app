import { useEffect, useState } from "react";

function FooterWeather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Taipei"); // ⭐ 預設城市

  useEffect(() => {
    fetch(`https://wttr.in/${city}?format=j1`)
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
  }, [city]); // ⭐ 當 city 改變時，自動更新天氣

  return (
    <div style={styles.weatherBox}>
      <h3>🌤 查詢天氣</h3>

      {/* ⭐ 使用者輸入 / 選擇城市 */}
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="輸入城市，例如 Taipei, Tokyo"
        style={styles.inputBox}
      />

      {weather ? (
        <>
          <h4>📍 {weather.city}</h4>
          <p>🌤 狀態：{weather.desc}</p>
          <p>🌡 溫度：{weather.temp}°C</p>
          <p>💧 濕度：{weather.humidity}%</p>
          <p>🌬 風速：{weather.wind} km/h</p>
        </>
      ) : (
        <p>⚠ 無法取得天氣資料</p>
      )}
    </div>
  );
}

const styles = {
  weatherBox: {
    marginTop: "50px",
    background: "#f1f4ff",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "400px",
    margin: "40px auto",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontSize: "15px",
    lineHeight: "1.8",
    color: "#1e3a8a",
  },
  inputBox: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #bbb",
    width: "80%",
    marginBottom: "10px",
    outline: "none",
  }
};

export default FooterWeather;
