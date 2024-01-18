# Use the official Node image as a base
FROM node:20.9.0

# Set the working directory
WORKDIR /src/app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./

# RUN npm install // bad practice
RUN npm install
# ci means coutinues integration

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the Node.js app
CMD ["npm", "start"]
