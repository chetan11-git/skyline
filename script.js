var API_KEY = "";

var form = document.getElementById("searchForm");
var cityInput = document.getElementById("cityInput");
var msg = document.getElementById("msg");
var result = document.getElementById("result");

form.onsubmit = function (e) {
  e.preventDefault();
  var city = cityInput.value.trim();
  if (city === "") return;
  search(city);
};

function search(city) {
  msg.textContent = "Loading...";
  msg.className = "";
  result.className = "hide";

  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) +
    "&units=metric&appid=" +
    API_KEY;

  fetch(url)
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "No city found with that name." : data.message
          );
        }
        return data;
      });
    })
    .then(function (data) {
      show(data);
      msg.textContent = "";
    })
    .catch(function (err) {
      msg.textContent = err.message;
      msg.className = "err";
    });
}

function show(data) {
  document.getElementById("cityName").textContent =
    data.name + ", " + data.sys.country;
  document.getElementById("desc").textContent = data.weather[0].description;
  document.getElementById("icon").src =
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
  document.getElementById("temp").textContent = Math.round(data.main.temp);
  document.getElementById("feels").textContent = Math.round(data.main.feels_like);
  document.getElementById("hum").textContent = data.main.humidity + "%";
  document.getElementById("wind").textContent =
    Math.round(data.wind.speed * 3.6) + " km/h";
  document.getElementById("press").textContent = data.main.pressure + " hPa";
  document.getElementById("vis").textContent =
    (data.visibility / 1000).toFixed(1) + " km";
  document.getElementById("rise").textContent = clock(data.sys.sunrise, data.timezone);
  document.getElementById("set").textContent = clock(data.sys.sunset, data.timezone);

  result.className = "";
}

// shows the city's local time from a unix timestamp
function clock(ts, shift) {
  var d = new Date((ts + shift) * 1000);
  var h = d.getUTCHours();
  var m = d.getUTCMinutes();
  return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
}