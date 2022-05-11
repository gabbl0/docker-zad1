const express = require('express');
const axios = require('axios');

const app = express();

let today = new Date().toLocaleDateString()
console.log("Name: Gabriela Blaszczak, date: " + today);

app.get('/', (req, res) => {
	//get ip & time
	axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=398bdc7b0afa43d69bf0f686194c7883')
    .then(response => {
		res.send('Hi, IP '+ response.data.ip_address +', your time: ' + response.data.timezone.current_time);
    })
    .catch(error => {
        console.log(error);
    });
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
});

