# TODO List App

## Index

- [Description](#description)
- [Task 1: Local development with MongoDB and React](#task-1-local-development-with-mongodb-and-react)
- [Task 2: Migrating to docker-compose, nginx and HTTPS setup](#task-2-migrating-to-docker-compose-nginx-and-https-setup)
  - [Development](#development)
  - [Production](#production)
  - [Kubernetes](#kubernetes)
  - [TLS/HTTPS To Keycloak](#tlshttps-to-keycloak)

---

## Description

TODO List App (MERN) with session management. Built using React for the frontend and Node.js for the backend with MongoDB. This guide covers local development, containerization with Docker, Kubernetes deployment, and HTTPS setup via Keycloak.

---

## Task 1: Local development with mongodb and react##

For running mongoDB in the cloud (mongoDB Atlas):
1. Create a cluster
2. create user and password(registered in the .env file)
3. choose the driver connection 

But as we have to run the database locally:
1. Install mongoDB
2. brew start mongodb-community
3. For checking the connection in shell: mongosh "mongodb+srv://clusterxxxxxx" --apiVersion 1 --username username

IMPORTANT: WHEN TESTING IT WITH POSTMAN:
Authorization: {token} <--- WITHOUT ADDING "Token" OR "Bearer" before the token itself

Before inizialising the backend, we have to create a .env file, inside the /backend folder, with our secret key: JWT_SECRET=example
For security reasons, add this file to the .gitignore

Now, we can run the backend: 
1. cd backend
2. nodemon server.js

Now, backend is ready for receiving requests from the frontend, so we run it with:
1. cd ../frontend
2. npm start

## Task 2: Migrating to docker-compose, nginx and HTTPS setup##

### Development

First, we migrate the backend to a docker container:
1. for testing just the node server (mongo running locally not in container), the uri should be:
- docker build -t test .
- docker run -d -p 3500:3500 test

Update dbConnection.js with: 
- const uri = "mongodb://host.docker.internal:27017/"; 

2. Once we know node image is working, we migrate the database to a container, for so, instead of 
   creating another dockerfile for the db, we will directly create it in the docker-compose 

3. Then, we change the uri of the dbConnection.js to process.env ones, as these are defined in the .yml.

4. Once full backend is tested and works, we have to integrate frontend. Before everything, we have to understand:

In task 1, When you run npm start, React uses Vite, webpack-dev-server, or React Scripts, depending on your setup.
This development server runs by default on localhost:3000 (unless it's taken).
It's only used during development and is not included in your production Docker image

When you do this in the Dockerfile:
RUN npm run build
It generates a static build of your React app in /build. Then, Nginx serves those files — and Nginx typically listens on port 80 inside the container, but we will use 3000

5. Now we create the default.conf of nginx, forwarding requests to services, to its inside containers ips and add it too to the docker-compose
add also mongo-express for visualizaing db: ADMIN; PASS

### Production

6. test it in production env by creating dockerfiles of production and adding other nginx inside frontend

Lets build and push the image of our frontend and backend testing them with:
- docker buildx build --platform linux/amd64,linux/arm64 -t your-dockerhub-username/your-image-name:tag . --push
and then docker run

### Kubernetes

4. You have to set the image used in the web-app.yaml to your-dockerhub-username/your-image-name:tag and also
 set the env linked to your mongo-secret and mongo-config, where you will have to indicate your credentials in base64
 Also Delete the .env file, just in case it interferes with process.env

5. Test everything with:
- minikube start --driver=docker
a. kubectl apply -f mongo-secret.yaml 
b. kubectl apply -f mongo-config.yaml 
c. kubectl apply -f mongo/
d. kubectl apply -f node/ 


After changing smth: 
- kubectl logs -l app=node-server
- kubectl delete configmap --all y asi con el resto

### /kubernetes/README.md for more information 

## TLS/HTTPS To Keycloak ##
### Certf x.509 for HTTPS
TODO: see how apply X.509 to digital firm

openssl req -x509 -out localhostcert.pem -keyout localhostkey.pem \ 
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

when loading the secured page: https://localhost:8043, we will have to set our local certificate as trusted

## Notes about Encryption and secure connections

### 1WSSL (One-Way SSL) ###
Means only the server is authenticated by the client (usually a browser or another service).
This is what happens in most secure websites like https://google.com:
1. The server shows its SSL/TLS certificate.
2. The client (your browser) verifies it.
3. If it's valid, a secure (encrypted) connection is established.

Common usage: Public HTPPS websites

### 2WSSL (Two-Way SSL) or Mutual TLS ###
Means both the server and the client authenticate each other.

1. The server presents its certificate (just like in 1WSSL).
2. The client also presents its own certificate.
3. The server verifies that the client's certificate is valid.
4. If both are okay, the secure connection is established.

Common usage: Private APIs, internal services

### 🔐 X.509 Certificates ###
These are the standard for public key certificates used in many cryptographic systems, including SSL/TLS. So when we talk about 1WSSL or 2WSSL, we're generally referring to X.509 certificates. These certificates contain:

* A public key
* Information about the entity (like the server or client)
* A digital signature that confirms the certificate's authenticity.

The certificate is issued by a Certificate Authority (CA), but you can also create self-signed certificates for testing purposes (like the ones I created earlier).

### ✉️ What is S/MIME? ###
It stands for Secure/Multipurpose Internet Mail Extensions. It’s a standard for sending encrypted and digitally signed emails using X.509 certificates.

* Email Encryption: Encrypts the email content so only the intended recipient can read it. Prevents eavesdroppingª.
* Digital Signature: Verifies that the email really came from the claimed sender. Ensures that the content hasn't been tamperedº with (message integrity).

ª: Eavesdropping means someone secretly listens in on your communication 
º: This means the message wasn't changed after it was sent.

Each participant (sender and receiver) has an X.509 certificate with a public/private key pair.
The public key is usually shared via email clients or directories.

Example:
You want to send Alice an encrypted email.
Alice has an X.509 certificate with her public key.
You use that key to encrypt the email.
Only Alice, who has the matching private key, can decrypt it.

It’s supported by most major email clients:

Email Client	S/MIME Support
Outlook	✅ Yes
Apple Mail	✅ Yes
Thunderbird	✅ Yes
Gmail (web)	🚫 Not directly (needs 3rd party extension)
