$(document).ready(function(){
    var key = 'f815af3a03b5f0d8c1fbfea0f95d1794/';
    var weatherCall = 'https://api.darksky.net/forecast/';
    var lat = false;
    var long;
    var haveInfo = false;
    var d;
    var dateString='';
    var dataObj;


    //run functions
    getLocation();


    //forecast tab butons
    $('.forecastButton').click(function(){
      console.log('clicked');
      $('.active').removeClass('active');
      $(this).addClass('active');
      $('.todayForecast').toggleClass('hidden');
      $('.weeklyForecast').toggleClass('hidden');
  //    $('.todayForecast').toggleClass('hidden');

    })


    //functions
    function getLocation(){
      //get users location
      if(navigator.geolocation){
        console.log('location aquired');

        //save current position
        navigator.geolocation.getCurrentPosition(function(position){
          console.log('getting current position');
          lat = position.coords.latitude;
          long = position.coords.longitude;
          callAPI();
        });
      }
      else {
        alert('Sorry, you need to enable location services in your browsers');
      }
    };

    function callAPI(){
      var api = 'https://cors-anywhere.herokuapp.com/'+weatherCall+key+  lat+','+long;
      console.log(api);
      $.getJSON(api, function(data){
        console.log(data);
        d = new Date(data.currently.time * 1000);
        setDateString(d);
        dataObj = data;
        setCurrentDay(dataObj);
        setStats(dataObj);
        setTodayForecast(dataObj);
        setWeeklyForecast(dataObj);
      });
    }

    function setStats(data){
      var rainChance = Math.round(data.currently.precipProbability * 100);
      var windDir = data.currently.windBearing;
      var windDirText = convertWind(windDir);
      console.log(windDirText);
      var windSpeed = Math.round(data.currently.windSpeed * 1.61);
      var humidity = data.currently.humidity * 100 ;
      var icon = data.currently.icon;
      console.log('insert forecast data');
      $('.rain').html('<i class="wi wi-rain"></i><p>'+rainChance+'%</p>');
      $('.windDir').html('<i class="wi wi-wind-direction"></i><p>'+windDirText+'</p>');
      $('.windSpeed').html('<i class="wi wi-strong-wind"></i><p>'+windSpeed+' km </p>');
      $('.humidity').html('<i class="wi wi-humidity"></i><p>'+humidity+'%</p>');

    }

    function convertWind(angle){
      var directions = ['N','NE','E','SE','S','SW','W','NW','N'];
      var finishAngles = [22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5,361];
      var textDir = '';
      var i = 0;
      while(angle>finishAngles[i] ){
        i++;
      }
      textDir = directions[i];
      return textDir;
    }

    function setCurrentDay(data){
      var currentTemp = Math.round((data.currently.temperature-32)*5/9);
      var timezone = data.timezone;
      var summary = data.currently.summary;
      var city = timezone.split('/')[1];
      $('.currentCity').html(city);
      $('.currentTemp').html(currentTemp+	'&deg;');
      $('.currentDescription').html(summary);
    }

    function setTodayForecast(data){
      var next4hours = [
        {
          time: new Date(data.hourly.data[1].time * 1000),
          summary: data.hourly.data[1].summary,
          maxTemp: Math.round((data.hourly.data[1].temperature-32)*5/9)
        },
        {
          time: new Date(data.hourly.data[2].time * 1000),
          summary: data.hourly.data[2].summary,
          maxTemp: Math.round((data.hourly.data[2].temperature-32)*5/9)
        },
        {
          time: new Date(data.hourly.data[3].time * 1000),
          summary: data.hourly.data[3].summary,
          maxTemp: Math.round((data.hourly.data[3].temperature-32)*5/9)
        },
        {
          time: new Date(data.hourly.data[4].time * 1000),
          summary: data.hourly.data[4].summary,
          maxTemp: Math.round((data.hourly.data[4].temperature-32)*5/9)
        }
      ];

      next4hours.forEach(function(hourObj,i){
        var hourForecast = generateLine(hourObj);
        $(".todayForecast").append(hourForecast);
      })
    }

    function setWeeklyForecast(data){
      var next7days = [

        {
          time: new Date(data.daily.data[1].time*1000),
          summary: data.daily.data[1].summary,
          maxTemp: Math.round((data.daily.data[1].temperatureMax-32)*5/9)
        },
        {
          time: new Date(data.daily.data[2].time*1000),
          summary: data.daily.data[2].summary,
          maxTemp: Math.round((data.daily.data[2].temperatureMax-32)*5/9)
        },
        {
          time: new Date(data.daily.data[3].time*1000),
          summary: data.daily.data[3].summary,
          maxTemp: Math.round((data.daily.data[3].temperatureMax-32)*5/9)
        },
        {
          time: new Date(data.daily.data[4].time*1000),
          summary: data.daily.data[4].summary,
          maxTemp: Math.round((data.daily.data[4].temperatureMax-32)*5/9)
        }
      ];

      next7days.forEach(function(day){
        var dayLine = generateDayLine(day);
        $('.weeklyForecast').append(dayLine);
      })
    }

    function generateLine(data){
      var hour =  moment(data.time).format('h:mm a');
      var code = '<div class="row"><div class="hourlyTime">'+hour+'</div><div class="hourlyDescription">'+data.summary+'</div><div class="hourlyTemp">'+data.maxTemp+'&deg</div> </div>';
      return code;
    }

    function generateDayLine(data){
      var day = moment(data.time).format('dddd');
      console.log(data.time);
      var code = '<div class="row"><div class="day">'+day+'</div><div class="dayDescription">'+data.summary+'</div><div class="dayTemp">'+data.maxTemp+'&deg</div> </div>';
      return code;
    }

    function setDateString(date){
      var dd = d.getDate();
      var mm = d.getMonth()+1;
      var yyyy = d.getFullYear();
      if(dd<10){
        dd='0'+dd;
      }
      if(mm<10){
        mm='0'+mm;
      }
      /*dateString = dd+'/'+mm+'/'+yyyy;*/
      dateString = moment(date).format('MMMM Do YYYY');

      $('.currentDate').html(dateString);
    }


});
