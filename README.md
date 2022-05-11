# docker-zad1
## 1. Kod programu:
### index.js
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

### package.json
{  
  "dependencies": {  
    "axios": "^0.27.2",  
    "express": "^4.18.1"  
  },  
  "scripts": {  
    "start": "node index.js"  
  }  
}  


## 2. Plik Dockerfile:
#Gabriela Blaszczak  
#build  
FROM node:latest AS build1  
WORKDIR /usr/app  
#install dependencies  
COPY ./package.json ./  
RUN npm install  
COPY ./ ./  
  
#production  
FROM node:alpine  
COPY --from=build1 /usr/app /usr/app  
WORKDIR /usr/app  
EXPOSE 8080  
CMD ["npm", "start"]  

## 3. polecenia niezbędne do:
a. zbudowania opracowanego obrazu kontenera:  
  docker build -t zad1:v1  
b. uruchomienia kontenera na podstawie zbudowanego obrazu  
  docker run -d -p 80:8080 zad1:v1  
c. sposobu uzyskania informacji, które wygenerował serwer w trakcie uruchamiana kontenera  
  docker logs \<container ID>  
d. sprawdzenia, ile warstw posiada zbudowany obraz.  
  docker image inspect zad1:v1  

### Zrzut ekranu okna przeglądarki
![image](https://user-images.githubusercontent.com/72490859/167739384-c4124970-ed88-436f-8b81-75683d065f27.png)
