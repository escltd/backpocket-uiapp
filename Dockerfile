# Install system dependencies
FROM node:16.14-alpine3.15 as userinterface
WORKDIR /userinterface

# Install nodejs dependencies
COPY package.json ./
RUN yarn install

# Copy and build source code 
COPY . .
RUN yarn build

# Install system dependencies
FROM nginx:alpine as frontend

# not needed for now; we're not using the nginx template to pass environement variables
#COPY nginx-default.conf.template /etc/nginx/templates/default.conf.template

# Copy the build output from the previous stage
COPY --from=userinterface /userinterface/dist /usr/share/nginx/html/.