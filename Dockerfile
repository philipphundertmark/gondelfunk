# Set the base image for subsequent instructions to Node.js 12 (LTS).
FROM node:12-alpine

# Set the working directory for any subsequent RUN, CMD, ENTRYPOINT, COPY and ADD instructions. 
WORKDIR /gondelfunk

# Copy files and directories from the current context into the image.
# Files that are ignored by .dockerignore won't be copied to the image.
COPY . .

# Install dependencies
RUN npm install

# Default command to execute when running the container.
CMD ["npm", "start"]
