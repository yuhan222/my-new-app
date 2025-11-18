import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AItest from './AItest';
import FooterWeather from './FooterWeather'; // ⭐ 新增這一行

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AItest />        
    <FooterWeather /> {/* ⭐ 天氣會顯示在最下面 */}
  </React.StrictMode>
);

reportWebVitals();
