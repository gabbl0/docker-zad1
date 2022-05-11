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

## 3. Polecenia niezbędne do:
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

## Obrazy kontenera na wiele architektur
Obrazy budowane są z wykorzystaniem GitHubActions i przesyłane na DockerHub (część podstawowa) i GitHub (część dodatkowa). Logowanie do GitHub Packages następuje przy użyciu GITHUB_TOKEN automatycznie tworzonego dla workflow. Dodatkowo ustawiony jest eksport cache.  
Link do repozytorium DockerHub: https://hub.docker.com/repository/docker/gabbla1/tch  
### Plik ustawień workflow
  
name: GitHub Action next2 flow to Docker hub  
  
on:  
  push:  
    branches: [ master ]  
  
jobs:  
 build-push-images:  
    name: Budowa i publikacja obrazow na repozytorium  
    runs-on: ubuntu-latest  
  
    steps:  
      - name: Checkout code  
        uses: actions/checkout@v2  
          
      - name: Set up QEMU  
        uses: docker/setup-qemu-action@v2  
  
      - name: Buildx set-up  
        id: buildx  
        uses: docker/setup-buildx-action@v1  
  
      - name: Login to Github Packages  
        uses: docker/login-action@v1  
        with:  
          registry: ghcr.io  
          username: ${{ github.actor }}  
          password: ${{ secrets.GITHUB_TOKEN }}  
  
      - name: Login to DockerHub  
        uses: docker/login-action@v1  
        with:  
          username: ${{ secrets.DOCKER_HUB_USERNAME }}  
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}  
  
      - name: Build and push  
        id: docker_build  
        uses: docker/build-push-action@v3  
        with:  
          context: ./  
          platforms: linux/amd64,linux/arm/v7,linux/arm64/v8  
          file: ./Dockerfile  
          push: true  
          tags: |  
	  #push to Dockerhub
            gabbla1/tch:zad1qemu  
	  #push to GitHub
            ghcr.io/gabbl0/docker-zad1/zad1qemu:latest  
	  #Cache export
          cache-from: type=registry,ref=gabbla1/tch:zad1qemu  
          cache-to: type=inline  
          
