FROM node:18-bookworm-slim
WORKDIR /myapp
COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "Client" ]
