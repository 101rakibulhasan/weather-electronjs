var loc = window.location.pathname;
var dir1 = loc.substring(0, loc.lastIndexOf('/'));
var dir = dir1.substring(0, dir1.lastIndexOf('/')) + "/setting.json";

window.addEventListener('load', ()=> {
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    let temperatureUnit = document.querySelector('.temperature-unit');
    let windSpeed = document.querySelector('.wind-speed');
    let rainProb = document.querySelector('.rain-prob');
    let thunderProb = document.querySelector('.thunder-prob');
    let snowProb = document.querySelector('.snow-prob');

    let cld_cvr = document.querySelector('.cloud_cover');
    let rain = document.querySelector('.rain_x');
    let rf_temp = document.querySelector('.rf_temp');
    let wind = document.querySelector('.wind_x');
    let wind_gust = document.querySelector('.wind_gust');
    let rel_humidity = document.querySelector('.rel_humidity');

    let snow = document.querySelector('.snow_x');
    let sol_irr = document.querySelector('.sol_irr');
    let uv_index = document.querySelector('.uv_index');
    let uv_index_text = document.querySelector('.uv_index_text');
    let vis = document.querySelector('.vis');
    let cell = document.querySelector('.cell');

    const tweleve_ul = document.querySelector('.unordered_hour_items');
    const tweleve_listItems = tweleve_ul.getElementsByTagName('li');
           
    let lockey;
    fetch(dir)
.then(response => {
        return response.json();
})
.then(datas => {
    lockey = datas.loc_key;
    const timezone = datas.cityName;


const api = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${lockey}?apikey=ErjXgI4B5q8sahrz5TR3qCAuxHbqhRHv&details=true`;
fetch(api)
    .then(response => {
        return response.json();
    })
    .then(data => {
        const temp = data[0].Temperature.Value;
        const unit = data[0].Temperature.Unit;
        const summary = data[0].IconPhrase;
        
        const windspeed = data[0].Wind.Speed.Value
        const windspeed_unit = data[0].Wind.Speed.Unit;

        const rain_prob = data[0].RainProbability;
        const thunder_prob = data[0].ThunderstormProbability;
        const snow_prob = data[0].SnowProbability;

        temperatureDegree.textContent = temp;
        temperatureDescription.textContent = summary;
        locationTimezone.textContent = timezone;
        temperatureUnit.textContent = "°" + unit;
        windSpeed.textContent = windspeed + " " + windspeed_unit;

        rainProb.textContent = rain_prob + " % ";
        thunderProb.textContent = thunder_prob + " % ";
        snowProb.textContent = snow_prob + " % ";

            let far = temp;
            let cel = Math.round((far - 32) * 5/9);
            if(datas.unit == "C"){
                temperatureUnit.textContent = "°" + "C";
                temperatureDegree.textContent = cel;
            }else{
                temperatureUnit.textContent = "°" + "F";
                temperatureDegree.textContent = far;
            }
        
        cld_cvr.textContent = "Cloud Cover : " +  data[0].CloudCover;
        rain.textContent = "Rain : " +  data[0].Rain.Value + " " +  data[0].Rain.Unit;
        snow.textContent = "Snow : " +  data[0].Snow.Value + " " +  data[0].Snow.Unit;
        vis.textContent = "Visibility : " +  data[0].Visibility.Value + " " +  data[0].Visibility.Unit;
        cell.textContent = "Ceiling : " +  data[0].Ceiling.Value + " " +  data[0].Ceiling.Unit;
        sol_irr.textContent = "Solar Irradiance : " +  data[0].SolarIrradiance.Value + " " +  data[0].SolarIrradiance.Unit;
        rf_temp.textContent = "Real Feel Temperature : " +  data[0].RealFeelTemperature.Value+ " " +  data[0].RealFeelTemperature.Unit;
        wind.textContent = "Wind Direction : " +  data[0].Wind.Direction.Degrees + " , " +  data[0].Wind.Direction.English;
        wind_gust.textContent = "Wind Gust : " +  data[0].WindGust.Speed.Value + " " +  data[0].WindGust.Speed.Unit;
        rel_humidity.textContent = "Relative Humidity : " + data[0].RelativeHumidity;
        uv_index.textContent = "UV Index : " + data[0].UVIndex;
        uv_index_text.textContent = "UV Index Text: " + data[0].UVIndexText;
    
})

const api_hourly = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${lockey}?apikey=ErjXgI4B5q8sahrz5TR3qCAuxHbqhRHv&details=true`;
fetch(api_hourly)
.then(response => {
    return response.json();
})
.then(datah => {
    fetch(dir)
.then(response => {
        return response.json();
})
.then(datas => {
    for(let i = 0; i <= tweleve_listItems.length - 1; i++)
    {
        if(datas.unit == "C"){
            let cel = Math.round((datah[i].Temperature.Value - 32) * 5/9);
            tweleve_listItems[i].querySelector('.temper').textContent = cel;
        }else{
            tweleve_listItems[i].querySelector('.temper').textContent = datah[i].Temperature.Value;
        }
        

        const myDate = datah[i].DateTime;
        const time = myDate.match(/\d\d:\d\d/);

        tweleve_listItems[i].querySelector('.time').textContent = time;
    }             
})
})
})

});

setting = document.querySelector(".setting_img");
setting.addEventListener("click", () => {
    ipcRenderer.send('go-setup');
    //window.close();
})

fullscrn = document.querySelector(".fullscreen_img");
fullscrn.addEventListener("click", () => {
    ipcRenderer.send('go-fullscrn');
})