FROM node

WORKDIR /app

COPY package*.json .

COPY . .

CMD ["node","app/index.js"]
