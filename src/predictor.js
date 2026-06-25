console.log("=== predictor.js LOADED ===");

let model = null;
let scaler = null;

export async function loadModel() {

    console.log("Loading model...");

    const modelResponse = await fetch("/model.json");
    model = await modelResponse.json();

    const scalerResponse = await fetch("/scaler.json");
    scaler = await scalerResponse.json();

    console.log("MODEL LOADED");
}

const featureIndex = {
    Temp_C: 0,
    Dew_Point_Temp_C: 1,
    Rel_Hum_pct: 2,
    Wind_Speed_kmh: 3,
    Visibility_km: 4,
    Press_kPa: 5
};

function scale(feature, value) {

    const idx = featureIndex[feature];

    return (
        value - scaler.mean[idx]
    ) / scaler.scale[idx];

}

function walkTree(node, input) {

    if ("class" in node) {
        console.log("✅ LEAF:", node.class);
        return node.class;
    }

    const value = input[node.feature];

    console.log(
        `Node: ${node.feature}`,
        "| value =", value,
        "| threshold =", node.threshold
    );

    if (value <= node.threshold) {
        console.log("➡️ LEFT");
        return walkTree(node.left, input);
    } else {
        console.log("➡️ RIGHT");
        return walkTree(node.right, input);
    }
}

export function predict(data) {

    const scaled = {
        Temp_C: scale("Temp_C", data.Temp_C),
        Dew_Point_Temp_C: scale("Dew_Point_Temp_C", data.Dew_Point_Temp_C),
        Rel_Hum_pct: scale("Rel_Hum_pct", data.Rel_Hum_pct),
        Wind_Speed_kmh: scale("Wind_Speed_kmh", data.Wind_Speed_kmh),
        Visibility_km: scale("Visibility_km", data.Visibility_km),
        Press_kPa: scale("Press_kPa", data.Press_kPa),
    };

    return walkTree(model, scaled);

}