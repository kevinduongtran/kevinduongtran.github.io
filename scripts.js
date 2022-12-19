
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    }

    // var x = document.getElementById("demo");
    // function getLocation() {
    //     console.log("LL")
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(showPosition,"eror");
    //   } else {
    //     console.log("Geolocation is not supported by this browser.");
    //   }
    // }
    
    // function showPosition(position) {
    //   console.log(position.coords.latitude + " " + position.coords.longitude);
    // }


    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function log(data) {
        const tag = document.createElement('p');
        tag.textContent = data;
        document.body.appendChild(tag);
      }
      
      function success(pos) {
        var crd = pos.coords;
        console.log('Successfully determined a user position:', crd);
      
        log('Your current position is:');
        log(`Latitude : ${crd.latitude}`);
        log(`Longitude: ${crd.longitude}`);
        log(`More or less ${crd.accuracy} meters.`);
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
      navigator.geolocation.getCurrentPosition(success, error, options);