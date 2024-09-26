# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Set environment variables (you can override these in docker-compose.yml)
ENV MONGO_URI="mongodb://mongo:27017/urlShortener"

# Start the Node.js app
CMD ["npm", "start"]
