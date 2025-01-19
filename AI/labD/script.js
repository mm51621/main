const apiKey = "842ca8a80b1aa08655f1a63f097389e5";

const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const weatherInfo = document.querySelector(".weather-info");

function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log("Aktualna pogoda (current):", response);
            weatherInfo.innerHTML = `
                <h2>Miasto: ${response.name}</h2>
                <p>Temperatura: ${response.main.temp}°C</p>
                <p>Opis: ${response.weather[0].description}</p>
            `;
        } else {
            console.error("Błąd w żądaniu (current):", xhr.statusText);
            weatherInfo.innerHTML = `<p style="color: red;">Nie znaleziono miasta!</p>`;
        }
    };

    xhr.onerror = function () {
        console.error("Wystąpił błąd podczas wysyłania żądania (current).");
        weatherInfo.innerHTML = `<p style="color: red;">Wystąpił błąd!</p>`;
    };

    xhr.send();
}

function getWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Prognoza pogody (forecast):", data);

            const forecastHTML = data.list
                .map(forecast => {
                    const date = new Date(forecast.dt * 1000);
                    return `
                        <div class="forecast-item">
                            <p><strong>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</strong></p>
                            <p>Temperatura: ${forecast.main.temp}°C</p>
                            <p>Opis: ${forecast.weather[0].description}</p>
                        </div>
                    `;
                })
                .join("");

            weatherInfo.innerHTML += `
                <h3>Prognoza pogody na 5 dni:</h3>
                <div class="forecast-container">${forecastHTML}</div>
            `;
        })
        .catch(error => {
            console.error("Wystąpił błąd podczas pobierania prognozy pogody (forecast):", error);
        });
}

searchButton.addEventListener("click", function () {
    const city = cityInput.value.trim();
    if (city === "") {
        alert("Wprowadź nazwę miasta!");
        return;
    }

    weatherInfo.innerHTML = "";
    getCurrentWeather(city);
    getWeatherForecast(city);
});
