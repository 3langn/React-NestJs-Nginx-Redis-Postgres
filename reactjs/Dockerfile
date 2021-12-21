FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
