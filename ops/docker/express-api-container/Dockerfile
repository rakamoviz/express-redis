FROM node:10.11.0-alpine

RUN apk update && apk upgrade
RUN apk add --no-cache bash curl vim nano zip autossh jq
RUN sed -i -e "s/bin\/ash/bin\/bash/" /etc/passwd
 
ENV LC_ALL=en_US.UTF-8

COPY tmp/express-api /root/express-api
WORKDIR /root/express-api
RUN npm install

CMD ["npm", "start"]