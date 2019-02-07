# Delete all images
# docker rmi $(docker images -q)
# Delete all containers
# docker rm $(docker ps -a -q)

# docker image build -t parcelspot_api_docs .
# docker run -d -p 8082:80 --name parcelspot_api_docs --rm parcelspot_api_docs

FROM nginx:alpine

COPY docs/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY docs/doc .