FROM artifacts.ggn.in.guavus.com:4245/srx-httpd:latest
COPY ./dist/apps/app/ /var/www/html/
EXPOSE 80
# Start the service
CMD ["/usr/sbin/apachectl", "-DFOREGROUND"]
