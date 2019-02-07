# Delete all images
# docker rmi $(docker images -q)
# Delete all containers
# docker rm $(docker ps -a -q)

# Install:
# stop current api container
# sudo docker ps
# sudo docker stop {container name}

# delete map
# git clone git@github.com:jeroenvo1/parcelspot_api.git
# cd naar map

# docker image build -t parcelspot_api .
# docker run -d -p 8081:8081 --rm parcelspot_api
# docker run -d -p 8081:8081 --rm jeroenvo/parcelspot-api:master-ab01c1z

# Commands in container
# docker exec -it CONTAINER_ID /bin/bash
# docker run -it --entrypoint /bin/bash jeroenvo/parcelspot-api:master-ab01c1z -s

# Port sluiten command
# sudo ufw deny 8082

FROM node:9.5.0

# Create app directory
WORKDIR /app

# Copy app dependencies to container and rebuild bcrypt lib
COPY package.json /app

# Install app dependencies
RUN npm install

# Bundle app source
COPY . /app

CMD npm run production

# Expose port
EXPOSE 8081