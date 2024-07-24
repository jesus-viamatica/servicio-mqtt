FROM node:20-bullseye
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV TZ America/Guayaquil
EXPOSE 3001
CMD ["npm", "start"]