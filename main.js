'use strict';


var arp = require('arp-table')()
var parse = require('arp-parse')()
var through = require('through')
var ping = require('ping')

let client = require('./init-client');
// parse.setMaxListeners(256)

var filter = require('stream-filter')(function(device) {
  return !!device.mac
})


var devices = ['dc:2b:2a:b:aa:49']

function checkDevices() {

	console.log("Arp! Arp!")
	arp.stdout
	  .pipe(parse)
	  .pipe(filter)
	  .pipe(through(function(device) {

	  	if (devices.indexOf(device.mac) >= 0) {
	  		this.queue(device.ip + '\n')
	  	}

	  }))
	  .pipe(through(function(ip) {

	  	ping.sys.probe(ip, function(isAlive){

	  		if (isAlive) {
	  			client.lights.getById(1)
	  			.then(light => {
	  			    console.log(`turning on light...`);

	  			    light.brightness = 254

	  			    return client.lights.save(light);
	  			  })
	  			  .then(light => {
	  			    console.log("Success")
	  			  })
	  			  .catch(error => {
	  			    console.log(error.stack);
	  			  });
	  		} else {
	  			client.lights.getById(1)
	  			.then(light => {
	  			    console.log(`turing off light...`);

	  			    light.brightness = 0

	  			    return client.lights.save(light);
	  			  })
	  			  .then(light => {
	  			    console.log("Success")
	  			  })
	  			  .catch(error => {
	  			    console.log(error.stack);
	  			  });
	  		}


	        // var msg = isAlive ? 'host ' + ' is alive' : 'host ' + ' is dead';
	        // console.log(msg);
	    })



	  }))

	  
}

checkDevices()
// setInterval(checkDevices, 5000)
