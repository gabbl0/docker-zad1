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
