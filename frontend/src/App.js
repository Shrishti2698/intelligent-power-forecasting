import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [forecastData, setForecastData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const forecastChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your backend URL

  useEffect(() => {
    initializeDashboard();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const initializeDashboard = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadForecastData(),
        loadWeatherData(),
        loadHolidayData()
      ]);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadForecastData = async () => {
    try {
      // Mock data for demonstration - replace with actual API call
      const mockForecastData = generateMockForecastData();
      
      // Uncomment and modify this when your API is ready:
      // const response = await fetch(`${API_BASE_URL}/forecast`);
      // const data = await response.json();
      
      setForecastData(mockForecastData);
      
      // Create chart after data is set
      setTimeout(() => {
        createForecastChart(mockForecastData);
      }, 100);
      
    } catch (error) {
      console.error('Error loading forecast data:', error);
    }
  };

  const loadWeatherData = async () => {
    try {
      // Mock weather data for demonstration
      const mockWeatherData = {
        temperature: 32.5,
        humidity: 68,
        cloudCover: 45,
        windSpeed: 12.3
      };

      // Uncomment and modify this when your API is ready:
      // const response = await fetch(`${API_BASE_URL}/weather`);
      // const data = await response.json();
      
      setWeatherData(mockWeatherData);
      
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
  };

  const loadHolidayData = async () => {
    try {
      // Mock holiday data for demonstration
      const mockHolidayData = [
        { date: '2025-07-15', name: 'Local Industrial Holiday', type: 'Industrial' },
        { date: '2025-07-20', name: 'Regional Festival', type: 'Festival' },
        { date: '2025-07-25', name: 'Municipal Day', type: 'Local' }
      ];

      // Uncomment and modify this when your API is ready:
      // const response = await fetch(`${API_BASE_URL}/holidays`);
      // const data = await response.json();
      
      setHolidayData(mockHolidayData);
      
    } catch (error) {
      console.error('Error loading holiday data:', error);
    }
  };

  const generateMockForecastData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 96; i++) { // 96 blocks for 24 hours (15-minute intervals)
      const time = new Date(now.getTime() + i * 15 * 60 * 1000);
      const hour = time.getHours();
      
      // Simulate realistic power demand pattern
      let baseLoad = 100;
      if (hour >= 6 && hour <= 9) baseLoad = 180; // Morning peak
      else if (hour >= 18 && hour <= 21) baseLoad = 200; // Evening peak
      else if (hour >= 22 || hour <= 5) baseLoad = 80; // Night low
      
      const demand = baseLoad + Math.sin(i * 0.1) * 20 + Math.random() * 10;
      
      data.push({
        time: time.toISOString(),
        demand: Math.round(demand * 10) / 10
      });
    }
    
    return data;
  };

  const createForecastChart = (data) => {
    const canvas = forecastChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    
    const labels = data.map(item => {
      const date = new Date(item.time);
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    });
    
    const demandData = data.map(item => item.demand);
    
    chartInstanceRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Power Demand (MW)',
          data: demandData,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#667eea',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            },
            ticks: {
              maxTicksLimit: 12
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Demand (MW)'
            },
            beginAtZero: false
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  };

  const refreshData = () => {
    setLastUpdated(new Date());
    initializeDashboard();
  };

  const getStats = () => {
    if (forecastData.length === 0) return { current: 0, peak: 0, avg: 0, status: 'Loading...' };
    
    const demands = forecastData.map(item => item.demand);
    const currentLoad = demands[0];
    const peakLoad = Math.max(...demands);
    const avgDemand = demands.reduce((a, b) => a + b, 0) / demands.length;
    
    let status = 'Normal';
    let statusColor = '#27ae60';
    
    if (currentLoad > 180) {
      status = 'High';
      statusColor = '#e74c3c';
    } else if (currentLoad > 140) {
      status = 'Medium';
      statusColor = '#f39c12';
    }
    
    return {
      current: currentLoad.toFixed(1),
      peak: peakLoad.toFixed(1),
      avg: avgDemand.toFixed(1),
      status,
      statusColor
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>⚡ APU Power Demand Forecasting</h1>
        <p>Real-time electricity demand prediction for Dhanbad, Jharkhand</p>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <h3>Current Load</h3>
          <div className="value">{stats.current} MW</div>
        </div>
        <div className="stat-item">
          <h3>Peak Predicted</h3>
          <div className="value">{stats.peak} MW</div>
        </div>
        <div className="stat-item">
          <h3>Avg Demand</h3>
          <div className="value">{stats.avg} MW</div>
        </div>
        <div className="stat-item">
          <h3>Status</h3>
          <div className="value" style={{ color: stats.statusColor }}>{stats.status}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card forecast-chart">
          <h2>
            <span className="icon">📈</span>
            24-Hour Power Demand Forecast
          </h2>
          <div className="chart-container">
            <canvas ref={forecastChartRef} id="forecastChart"></canvas>
          </div>
        </div>

        <div className="card">
          <h2>
            <span className="icon">🌤️</span>
            Weather Conditions
          </h2>
          {weatherData ? (
            <div className="weather-grid">
              <div className="weather-item">
                <h3>Temperature</h3>
                <div className="value">{weatherData.temperature}°C</div>
              </div>
              <div className="weather-item">
                <h3>Humidity</h3>
                <div className="value">{weatherData.humidity}%</div>
              </div>
              <div className="weather-item">
                <h3>Cloud Cover</h3>
                <div className="value">{weatherData.cloudCover}%</div>
              </div>
              <div className="weather-item">
                <h3>Wind Speed</h3>
                <div className="value">{weatherData.windSpeed} km/h</div>
              </div>
            </div>
          ) : (
            <div className="loading">
              <div className="spinner"></div>
              Loading weather data...
            </div>
          )}
        </div>

        <div className="card">
          <h2>
            <span className="icon">🎉</span>
            Local Holidays & Events
          </h2>
          {holidayData.length > 0 ? (
            <table className="holiday-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Holiday/Event</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {holidayData.map((holiday, index) => (
                  <tr key={index}>
                    <td>{new Date(holiday.date).toLocaleDateString('en-IN')}</td>
                    <td>{holiday.name}</td>
                    <td>{holiday.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="loading">
              <div className="spinner"></div>
              Loading holiday data...
            </div>
          )}
        </div>
      </div>

      <div className="last-updated">
        Last updated: {lastUpdated.toLocaleString('en-IN')}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <button className="refresh-btn" onClick={refreshData}>
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default App;