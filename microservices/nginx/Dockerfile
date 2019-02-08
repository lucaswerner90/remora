FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./ssl ./etc/nginx/ssl
RUN nginx -c /etc/nginx/nginx.conf -t
EXPOSE 443