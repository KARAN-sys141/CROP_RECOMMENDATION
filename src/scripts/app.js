const cropRecommendations = {
    "wheat": ["Loamy soil", "Moderate rainfall"],
    "rice": ["Clayey soil", "High rainfall"],
    "maize": ["Well-drained soil", "Moderate rainfall"],
    "sorghum": ["Sandy soil", "Low rainfall"],
    "barley": ["Loamy soil", "Cool climate"]
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("crop-form");
    const resultSection = document.getElementById("result");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const soilType = document.getElementById("soil-type").value;
        const rainfall = document.getElementById("rainfall").value;

        const recommendations = getCropRecommendations(soilType, rainfall);
        displayRecommendations(recommendations);
    });
});

function getCropRecommendations(soilType, rainfall) {
    const recommendations = [];

    for (const [crop, conditions] of Object.entries(cropRecommendations)) {
        if (conditions[0].toLowerCase().includes(soilType.toLowerCase()) && 
            conditions[1].toLowerCase().includes(rainfall.toLowerCase())) {
            recommendations.push(crop);
        }
    }

    return recommendations.length > 0 ? recommendations : ["No suitable crops found."];
}

function displayRecommendations(recommendations) {
    resultSection.innerHTML = "";
    recommendations.forEach(crop => {
        const cropElement = document.createElement("div");
        cropElement.classList.add("crop-item");
        cropElement.textContent = crop;
        resultSection.appendChild(cropElement);
    });
}

document.getElementById('cropForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        N: document.getElementById('N').value,
        P: document.getElementById('P').value,
        K: document.getElementById('K').value,
        temperature: document.getElementById('temperature').value,
        humidity: document.getElementById('humidity').value,
        ph: document.getElementById('ph').value,
        rainfall: document.getElementById('rainfall').value
    };

    const box = document.getElementById('recommendationBox');
    const result = document.getElementById('cropResult');
    box.style.display = 'block';
    result.textContent = "Loading...";
    result.classList.remove('animate');

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(res => {
        if (res.crop) {
            result.textContent = res.crop ;
        } else {
            result.textContent = "Error: " + (res.error || "No recommendation");
        }
        result.classList.add('animate');
    })
    .catch(() => {
        result.textContent = "Server error. Please try again.";
        result.classList.add('animate');
    });
});