
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    }

    var x = document.getElementById("demo");
    function getLocation() {
        console.log("LL")
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,"eror");
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
    
    function showPosition(position) {
      console.log(position.coords.latitude + " " + position.coords.longitude);
    }
