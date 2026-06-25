import "./style.css";
import { loadModel, predict } from "./predictor";

await loadModel();

document.querySelector("#app").innerHTML = `
<div class="container">

  <div class="header">

    <h1>🌦️ Prediksi Cuaca</h1>

    <p>
        Prediksi kondisi cuaca menggunakan
        <b>Machine Learning Decision Tree</b>
    </p>

</div>

  <div class="input-group">

    <label for="temp">
        🌡️ Temperatur (°C)
    </label>

    <input
        id="temp"
        type="number"
        step="any"
        placeholder="Contoh: 25.5"
    >

</div>

<div class="input-group">

    <label for="dew">
        💧 Titik Embun (°C)
    </label>

    <input
        id="dew"
        type="number"
        step="any"
        placeholder="Contoh: 18"
    >

</div>

<div class="input-group">

    <label for="hum">
        💦 Kelembapan (%)
    </label>

    <input
        id="hum"
        type="number"
        step="any"
        placeholder="0 - 100"
    >

</div>

<div class="input-group">

    <label for="wind">
        🌬️ Kecepatan Angin (km/jam)
    </label>

    <input
        id="wind"
        type="number"
        step="any"
        placeholder="Contoh: 15"
    >

</div>

<div class="input-group">

    <label for="vis">
        👀 Visibilitas (km)
    </label>

    <input
        id="vis"
        type="number"
        step="any"
        placeholder="Contoh: 25"
    >

</div>

<div class="input-group">

    <label for="press">
        📈 Tekanan Udara (kPa)
    </label>

    <input
        id="press"
        type="number"
        step="any"
        placeholder="Contoh: 101.3"
    >

</div>

  <div class="button-group">
      <button id="predictBtn">

        🔍 Prediksi

      </button>

      <button id="resetBtn">

        🔄 Reset

      </button>
  </div>

  <div id="result"></div>
  <footer>

    Decision Tree • Accuracy 65.34%

  </footer>
</div>
`;


// ======================
// Tombol Reset
// ======================

document
.getElementById("resetBtn")
.addEventListener("click", () => {

    document.querySelectorAll("input").forEach(input => {
        input.value = "";
    });

    document.getElementById("result").innerHTML = "";

    document.getElementById("temp").focus();

});


// ======================
// Tombol Prediksi
// ======================

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


    // ======================
    // Validasi Input
    // ======================

    if (Object.values(payload).some(value => isNaN(value))) {
        alert("Semua data harus diisi.");
        return;
    }

    if (payload.Rel_Hum_pct < 0 || payload.Rel_Hum_pct > 100) {
        alert("Kelembapan harus berada di antara 0% sampai 100%.");
        return;
    }

    if (payload.Visibility_km < 0) {
        alert("Visibility tidak boleh bernilai negatif.");
        return;
    }

    if (payload.Wind_Speed_kmh < 0) {
        alert("Kecepatan angin tidak boleh bernilai negatif.");
        return;
    }

    if (payload.Press_kPa <= 0) {
        alert("Tekanan udara harus lebih besar dari 0.");
        return;
    }


    try {

        const result = document.getElementById("result");

        // Loading
        result.innerHTML = `
            <div class="loading">
                ⏳ Sedang memprediksi...
            </div>
        `;

        await new Promise(resolve => setTimeout(resolve, 500));

        const hasil = predict(payload);

        let icon = "";
        let description = "";
        let resultClass = "";

        switch (hasil) {

            case "Clear":
                icon = "☀️";
                description = "Langit diprediksi cerah.";
                resultClass = "clear";
                break;

            case "Cloudy":
                icon = "☁️";
                description = "Cuaca diprediksi berawan.";
                resultClass = "cloudy";
                break;

            case "Rain":
                icon = "🌧️";
                description = "Kemungkinan terjadi hujan.";
                resultClass = "rain";
                break;

            case "Snow":
                icon = "❄️";
                description = "Kemungkinan turun salju.";
                resultClass = "snow";
                break;

            case "Fog":
                icon = "🌫️";
                description = "Kabut diperkirakan muncul.";
                resultClass = "fog";
                break;

            default:
                icon = "🌤️";
                description = "Prediksi tidak diketahui.";
                resultClass = "";
        }

        document.body.className = "";
        document.body.classList.add(`bg-${hasil.toLowerCase()}`);

        result.innerHTML = `
            <div class="result-card ${resultClass}">
                <div class="weather-icon">${icon}</div>

                <h2>${hasil}</h2>

                <p>${description}</p>
            </div>
        `;

    } catch (err) {

        document.getElementById("result").innerHTML = `
            <div class="result-card">
                <h2>❌ Terjadi Error</h2>
                <p>Prediksi gagal dilakukan.</p>
            </div>
        `;

        console.error(err);
    }

});