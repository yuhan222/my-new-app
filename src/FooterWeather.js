import { useEffect, useState } from "react";

function FooterWeather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Taipei"); // 👉 預設顯示台北

  // ⭐ 當使用者改變城市時，自動更新天氣
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
  }, [city]);

  return (
    <div style={styles.weatherBox}>
      <h3>🌤 今日天氣查詢</h3>

      {/* ⭐ 改成下拉式選單（Dropdown），不需要輸入框 */}
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
  selectBox: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #bbb",
    marginBottom: "15px",
    width: "85%",
    outline: "none",
    cursor: "pointer",
    fontSize: "15px",
  }
};

export default FooterWeather;
