$(document).ready(function() {
//global variables for testing and demonstration of functionality
    var cities = ["New York, New York", "London, England", "Los Angeles, California"];
    
    //wrapper function to allow access to city variable across all functions 
    function displayCityInfo() {

        var city = $(this).attr("data-name");
        console.log(city);
        $("#weather-forecast").empty();
        
        //function to display current weather conditions on selected city
        function displayWeather(){
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + "166a433c57516f51dfab1f7edaed8413";

            $.ajax({
              url: queryURL,
              method: "GET"
           }).then(function(response) {
             //console log to view object returned by API call
              console.log(response);
    
              var cityDiv = $("<div class='city'>");
              //convert degrees K to degrees F
              var Ftemp = (response.main.temp - 273.15) *1.8 +32;;
              var humidity = (response.main.humidity);
              var windSpeed = (response.wind.speed);
              
              //generates html to page
              var hOne = $("<h3>").text("Current weather conditions for " + city);
              var pOne = $("<p>").text("Temperature: " + Ftemp.toFixed(0) + " °F");
              var pTwo = $("<p>").text("Humidity: " + humidity + "%");
              var pThree = $("<p>").text("Wind Speed: " + windSpeed.toFixed(0) + " m.p.h.");
              var hTwo = $("<h4>").text("5-Day Forecast for " + city);
    
              cityDiv.append(hOne, pOne, pTwo, pThree, hTwo);
             
              //removes prior weather info and updates with latest city click
              $("#current-weather").empty();
              $("#current-weather").prepend(cityDiv);

              uvNice(response.coord.lat, response.coord.lon);
            });
        };
        
        //currently still in development to show UV Index under current weather conditions
        function uvNice(lat,lon) {
           
            var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=166a433c57516f51dfab1f7edaed8413" + lat + "&lon=" + lon;

            $.ajax({
                url: queryURL,
                method: "GET"
             }).then(function(response) {
        
                console.log(response);
      
              });
        };
        // API call to return 5-day forecast for selected city
        function fiveDay() {
            console.log(city);
            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" + "q=" + city + "&appid=" + "166a433c57516f51dfab1f7edaed8413";

            $.ajax({
                url: queryURL,
                method: "GET"
             }).then(function(response) {
        
                console.log(response);

                // create loop through array for forecasted tempts at noon daily
                for (var i = 0; i < response.list.length; i++) {
                   
                    if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                     
                    // create card content for weather forecast
                      var col = $("<div class='col-md-2'>");
                      var card = $("<div class='bg-primary text-white'>");
                      var body = $("<div class='card-body p-2'>");
          
                      var date = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
          
                      var png = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
          
                      var pOne = $("<p>").addClass("card-text").text("Temp: " + ((response.list[i].main.temp_max - 273.15) * 1.8 + 32).toFixed(0)+ " °F");
                      var pTwo = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity + "%");
          
                    //appends data to the page
                      $("#weather-forecast").append(col);
                      
                      col.append(card.append(body.append(date, png, pOne, pTwo)));
                      $("#weather-forecast").prepend(col);
                    }
                  }
            });
            }

        displayWeather();
        fiveDay();
      }
    
     // generates list of cities 
      function renderButtons() {
        $("#buttons-view").empty();
        for (var i = 0; i < cities.length; i++) {
          var a = $("<button>");
          // Adds class 
          a.addClass("city");
          // Adds a data-attribute with a value of the city at index i
          a.attr("data-name", cities[i]);
          // Providing the button's text with a value of the city at index i
          a.text(cities[i]);
          // Adds the button to the HTML
          $("#buttons-view").append(a);
      }
    }
//adds city to list of searchable cities on left pan
    $("#add-city").on("click", function(event) {
      event.preventDefault();
      var city = $("#city-input").val().trim();
      cities.push(city);
      renderButtons();
      });
     
      $(document).on("click", ".city", displayCityInfo);
      //renders buttons again with every add
      renderButtons();
});