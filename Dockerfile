# Use an official Node.js runtime as the base image
FROM node:20

# Create and set the working directory within the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on (update if necessary)
EXPOSE 3000

# Define the command to start the server
CMD ["npm", "start"]
