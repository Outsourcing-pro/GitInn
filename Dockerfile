FROM nginx:alpine
RUN apk update && \
    apk upgrade && \
    apk add --update nodejs && \
    rm -rf /var/cache/apk/*
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

ADD . /src
RUN /src/build.sh
