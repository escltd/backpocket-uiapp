ARG REPOSITORY="savalite/images:backpocket-latest"
FROM ${REPOSITORY} AS golang-base
FROM node:latest as vuejs-base

WORKDIR /vuejs/
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build


FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /deploy/
COPY --from=golang-base /deploy .
COPY --from=vuejs-base /vuejs/dist uiapp
EXPOSE 8181
CMD ["./backpocket_linux.elf"]  