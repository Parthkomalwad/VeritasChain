FROM node:20-slim

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Install serve to run the build
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the application with serve for production
# For development, this would be: CMD ["npm", "start"]
CMD ["serve", "-s", "build", "-l", "3000"]