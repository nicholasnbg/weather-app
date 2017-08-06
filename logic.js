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
      $.getJSON(api, function(data){
        console.log(data);
        d = new Date(data.currently.time * 1000);
        setDateString(d);
        dataObj = data;
        setCurrentDay(dataObj);
      });
    }

    function setCurrentDay(data){
      var currentTemp = Math.round((data.currently.temperature-32)*5/9);
      var timezone = data.timezone;
      var summary = data.currently.summary;
      var city = timezone.split('/')[1];
      $('.currentCity').html(city);
      $('.currentTemp').html(currentTemp+	'	&#8451;');
      $('.currentDescription').html(summary);
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
