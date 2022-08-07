FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY  . .
RUN npm run build:clean
CMD [ "node" ,"build/bundle.js" ]