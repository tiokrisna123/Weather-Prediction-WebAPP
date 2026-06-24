from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model_path = os.path.join(os.path.dirname(__file__), "model_dt.joblib")
model = joblib.load(model_path)


class WeatherInput(BaseModel):
    Temp_C: float
    Dew_Point_Temp_C: float
    Rel_Hum_pct: float
    Wind_Speed_kmh: float
    Visibility_km: float
    Press_kPa: float


@app.get("/")
def root():
    return {"status": "API berjalan"}


@app.post("/predict")
def predict(data: WeatherInput):
    try:

        input_df = pd.DataFrame([{
            "Temp_C": data.Temp_C,
            "Dew Point Temp_C": data.Dew_Point_Temp_C,
            "Rel Hum_%": data.Rel_Hum_pct,
            "Wind Speed_km/h": data.Wind_Speed_kmh,
            "Visibility_km": data.Visibility_km,
            "Press_kPa": data.Press_kPa
        }])

        prediction = model.predict(input_df)

        return {
            "prediction": str(prediction[0])
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )