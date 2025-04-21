# Build phase
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#It builds the app (npm run build), which generates static files in /app/build.
# Then it uses Nginx, which runs on port 80, to serve those static files.
# So, in production, app is no longer on port 3000, but on port 80, thanks to Nginx.
    
    
# Serve static build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
