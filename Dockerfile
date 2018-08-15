FROM gitlab.anadarko.com:4567/build-tools/angular-nginx:master

COPY dist/ /usr/share/nginx/html
