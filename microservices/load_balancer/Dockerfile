FROM nginx:alpine
COPY ./load_balancer.conf /etc/nginx/nginx.conf
EXPOSE 80
HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=3 CMD [ "curl -X POST http://localhost:8080/api/auth/login" ]