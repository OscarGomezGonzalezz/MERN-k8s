### Build stage ###
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# --production will ignore the devDependencies and only install the packages needed to run the application.
RUN npm update && npm install --production

# Copy the rest of the application files
COPY . .

### Production stage ###
FROM node:20-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

# Change ownership so the node user can access the files
RUN chown -R node:node /app

#Remove privileged access switching to user node for security reasons
USER node 


CMD ["npm", "run", "start"]
