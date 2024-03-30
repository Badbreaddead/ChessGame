# Development stage
FROM node:20 as dev
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
CMD ["npm", "start"]

# Build stage
FROM node:20 as build
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as prod
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]