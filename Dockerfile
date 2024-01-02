FROM node:18.0.0

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --network-concurrency 1

COPY . .

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19006

CMD ["sh", "-c", "sleep 5 && sync && expo run:ios --tunnel"]