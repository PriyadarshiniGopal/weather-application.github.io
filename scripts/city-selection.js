import { celciustofahrenheit, dateTime } from "./utility.js";
"use strict";
let MainData, repeat;

//retrieve json data
fetch('./data/data.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        MainData = data;
        list();
    });

//dynamic datalist
function list() {
    let list = document.getElementById("city-list");
    let cities = Object.keys(MainData);
    for (let city of cities) {
        let option = document.createElement('option');
        option.value = MainData[city]['cityName'];
        list.appendChild(option);
    }
}

//values fetched
let cityinput = document.getElementById("city");

//IIFE for show input message
(function () {
    cityinput.style.border = "2px solid red";
})()

//validation
function inputValidation() {
    let inputbox = cityinput;
    let inputText = inputbox.value;
    for (let City in MainData) {
        if (MainData[City]['cityName'] === inputText) {
            document.getElementById("error-msg").textContent = "";
            inputbox.style.border = "none";
            return;
        }
    }
    document.getElementById("error-msg").textContent = "INVALID CITY NAME";
    inputbox.style.border = "2px solid red";
    document.getElementById("selected-city-icon").src = "";
    document.getElementById("temp-c").innerHTML = 'NIL';
    document.getElementById("temp-f").innerHTML = 'NIL';
    document.getElementById("city-humidity").innerHTML = 'NIL';
    document.getElementById("city-precipitation").innerHTML = 'NIL';
    let time = document.querySelectorAll(".forecast-time");
    let icon = document.querySelectorAll(".next-weather-icon");
    let temp = document.querySelectorAll(".next-temp");
    for (let child of time) {
        if (child !== time[0]) {
            child.textContent = 'NIL';
        }
    }
    for (let index = 0; index < temp.length; index++) {
        temp[index].innerHTML = 'NIL';
    }
}
//eventHandler to stop reloading
let form = document.getElementById("city-name-form");
function handleForm(event) {
    event.preventDefault();
}

function clock(timezone) {
    document.querySelector(".date").innerHTML = (dateTime(timezone, 'date'));
    document.querySelector(".time").innerHTML = (dateTime(timezone, 'time'));
    document.querySelector(".sec").innerHTML = " : " + (dateTime(timezone, 'seconds'));
    let period = dateTime(timezone, 'period');
    document.getElementById("period").src = "./assets/icons/general/" + period + "State.svg";
}
//next hour
function nextHour(hour) {
    let hr = hour.slice(0, -2);
    let state = hour.slice(-2);
    hr = Number(hr);
    if (hr == 11)
        state = state === 'AM' ? 'PM' : 'AM';
    hr = hr >= 12 ? hr - 12 + 1 : hr + 1;
    return hr + state;
}
//to find icon for weather
function weatherIcon(temp) {
    temp = temp.slice(0, -2);
    temp = Number(temp);
    return temp > 29 ? "sunny" : temp >= 23 ? "cloudy" : temp >= 18 ? "rainy" : "windy";
}
//weather forecast
function weather(hour, cityName) {
    let time = document.querySelectorAll(".forecast-time");
    let icon = document.querySelectorAll(".next-weather-icon");
    let temp = document.querySelectorAll(".next-temp");
    for (let child of time) {
        if (child !== time[0]) {
            hour = nextHour(hour);
            child.textContent = hour;
        }
    }
    for (let index = 0; index < temp.length; index++) {
        let temperature = MainData[cityName]['nextFiveHrs'][index];
        temp[index].innerHTML = temperature;
        let weather = weatherIcon(temperature);
        icon[index].src = "./assets/icons/weather/" + weather + "Icon.svg";
    }
}
//event Handler to change topsection 
function topsection() {
    let cityName = cityinput.value;
    cityName = cityName.toLowerCase();
    document.getElementById("selected-city-icon").src = (`./assets/icons/Cities/${cityName}.svg`);
    document.getElementById("temp-c").innerHTML = (MainData[cityName]['temperature']);
    document.getElementById("temp-f").innerHTML = celciustofahrenheit(MainData[cityName]['temperature']);
    document.getElementById("city-humidity").innerHTML = MainData[cityName]['humidity'];
    document.getElementById("city-precipitation").innerHTML = MainData[cityName]['precipitation'];
    if (repeat) {
        clearInterval(repeat);
    }
    let timezone = MainData[cityName]['timeZone'];
    repeat = setInterval(clock, 1000, timezone);
    let hr = (dateTime(timezone, 'hour')) + "" + (dateTime(timezone, 'period')).toUpperCase();
    weather(hr, cityName);
}
form.addEventListener('submit', handleForm);
form.addEventListener('submit', topsection);
form.addEventListener('input', inputValidation);
form.dispatchEvent(new Event("input"));
