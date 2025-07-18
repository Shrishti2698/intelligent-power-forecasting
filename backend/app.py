import os
import gdown
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, numpy as np
from datetime import datetime, timedelta, date

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_URL = "https://drive.google.com/uc?export=download&id=1T3UXUCx0_IPS3vNB5I_Akvt2qC3Dv1bl"
MODEL_PATH = "backend/model.pkl"  # correct path based on your folder

if not os.path.exists(MODEL_PATH):
    print("Downloading model from Google Drive...")
    gdown.download(MODEL_URL, MODEL_PATH, quiet=False)
    print("Model downloaded.")


# Load model
model = joblib.load("model.pkl")

# Input schema for single prediction
class PowerLoadInput(BaseModel):
    F2_132KV_PowerConsumption: float
    F3_132KV_PowerConsumption: float
    temperature: float
    humidity: float
    wind_speed: float
    cloud_cover: float
    is_holiday: int
    hour: int
    dayofweek: int

@app.get("/")
def root(): return {"message": "Forecast API live"}

@app.post("/predict")
def predict(data: PowerLoadInput):
    arr = np.array([[
        data.F2_132KV_PowerConsumption,
        data.F3_132KV_PowerConsumption,
        data.temperature,
        data.humidity,
        data.wind_speed,
        data.cloud_cover,
        data.is_holiday,
        data.hour,
        data.dayofweek
    ]])
    return {"predicted_F1_132KV_PowerConsumption": round(float(model.predict(arr)[0]),2)}

# --------------------------------------------------------
# NEW ENDPOINT: Forecast next 24 hr (96 blocks)
# --------------------------------------------------------
@app.get("/forecast_24h")
def forecast_24h(
    F2: float, F3: float,
    temperature: float, humidity: float,
    wind_speed: float, cloud_cover: float,
    is_holiday: int, base_datetime: str = None
):
    base = datetime.fromisoformat(base_datetime) if base_datetime else datetime.now()
    preds = []
    curr_values = [F2, F3, temperature, humidity, wind_speed, cloud_cover]
    for i in range(96):
        dt = base + timedelta(minutes=10*i)
        hour, dow = dt.hour, dt.weekday()
        inp = np.array([[*curr_values, is_holiday, hour, dow]])
        pred = float(model.predict(inp)[0])
        preds.append({"datetime": dt.isoformat(), "F1": round(pred,2)})
    return {"forecast": preds}

# --------------------------------------------------------
# NEW ENDPOINT: Weather + Holiday schedule
# --------------------------------------------------------
@app.get("/weather_holidays")
def weather_holidays(base_datetime: str = None):
    base = datetime.fromisoformat(base_datetime) if base_datetime else datetime.now()
    # simulate static or seasonal
    days = []
    # define local holiday list for 2017
    local = [
        date(2017,1,14), date(2017,3,13),
        date(2017,4,14), date(2017,5,1),
        date(2017,8,15), date(2017,10,2),
        date(2017,9,29), date(2017,10,26),
        date(2017,10,19), date(2017,12,25),
    ]
    for i in range(96):
        dt = base + timedelta(minutes=10*i)
        days.append({
            "datetime": dt.isoformat(),
            "temperature": temperature,
            "humidity": humidity,
            "wind_speed": wind_speed,
            "cloud_cover": cloud_cover,
            "is_holiday": 1 if dt.date() in local else 0
        })
    return {"weather_holidays": days}
