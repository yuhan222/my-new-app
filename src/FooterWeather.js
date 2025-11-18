import { useEffect, useState } from "react";

function FooterWeather() {
  const [weather, setWeather] = useState(null);

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
  );
}

const styles = {
  weatherBox: {
    marginTop: "50px",
    background: "#f1f4ff",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "400px",
    margin: "auto",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
};

export default FooterWeather;
