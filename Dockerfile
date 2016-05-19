###########################################################
#
# Dockerfile for tasks-user
#
###########################################################

# Setting the base to nodejs 4.4.4
FROM mhart/alpine-node:4.4.4

# Maintainer
MAINTAINER Geir Gåsodden

#### Begin setup ####

# Installs git
RUN apk add --update --no-cache git

# Extra tools for native dependencies
RUN apk add --no-cache make gcc g++ python

# Bundle app source
COPY . /src

# Change working directory
WORKDIR "/src"

# Install dependencies
RUN npm install --production

# Env variables
ENV TASKS_USER_TAG tasks-user
ENV TASKS_USER_HOST localhost
ENV TASKS_USER_PORT 8000
ENV TASKS_USER_MONGODB_URI mongodb://localhost:27017/tasks

# Startup
CMD ["node", "service.js", "--seneca-log=type:act"]