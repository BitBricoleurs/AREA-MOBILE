FROM node:20.7.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19006

ENTRYPOINT ["npm", "start"]
CMD [ "i" ]
