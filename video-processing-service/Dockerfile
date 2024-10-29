# Stage 1: Build stage
FROM node:18 AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production stage
FROM node:18

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from the builder stage
COPY --from=builder /app/dist ./dist

# Make port 3000 available to the world outside this container

EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "run", "serve" ]



# # docker is used to containerise app. docker can package dependencies and environment to run in other machines like the server.

# #start with a base image. node:18 image includes node js and is built on top of a linux image. And building my own image on top of that.

# #use official Node run time as a parent image.
# FROM node:18

# #Set working directory in the container to /app
# WORKDIR /app

# # Copy package.json and package-lock.json into the working directory
# COPY package*.json ./

# # Install ffmpeg in the container
# RUN apt-get update && apt-get install -y ffmpeg

# #Copy app source inside the docker image
# COPY . .

# #make port 3000 available outside this container
# EXPOSE 3000
# EXPOSE 8080

# #Define the command to run your app using CMD(only one CMD allowed)
# CMD [ "npm", "start" ]


