FROM nginx:alpine
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./packages/public/client/build /usr/share/nginx/html