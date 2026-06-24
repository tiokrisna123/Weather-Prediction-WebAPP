import "./style.css";

document.querySelector("#app").innerHTML = `
<div class="container">
  <h1>🌦️ Prediksi Cuaca</h1>

  <input id="temp" type="number" placeholder="Temp_C">

  <input id="dew" type="number" placeholder="Dew Point Temp_C">

  <input id="hum" type="number" placeholder="Rel Hum_%">

  <input id="wind" type="number" placeholder="Wind Speed_km/h">

  <input id="vis" type="number" placeholder="Visibility_km">

  <input id="press" type="number" placeholder="Press_kPa">

  <button id="predictBtn">
    Prediksi Cuaca
  </button>

  <div id="result"></div>
</div>
`;

document
  .getElementById("predictBtn")
  .addEventListener("click", async () => {

    const payload = {
      Temp_C: Number(document.getElementById("temp").value),
      Dew_Point_Temp_C: Number(document.getElementById("dew").value),
      Rel_Hum_pct: Number(document.getElementById("hum").value),
      Wind_Speed_kmh: Number(document.getElementById("wind").value),
      Visibility_km: Number(document.getElementById("vis").value),
      Press_kPa: Number(document.getElementById("press").value)
    };

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      document.getElementById("result").innerHTML =
        `<h2>Hasil: ${data.prediction}</h2>`;

    } catch (err) {

      document.getElementById("result").innerHTML =
        `<h2>Terjadi Error</h2>`;

      console.error(err);
    }
});