FROM golang:1.15 AS builder

WORKDIR /opt/app/src/github.com/password-management/server
ENV GOPATH /opt/app
ADD . .
ENV GOOS=linux GOARCH=amd64
RUN go get -v ./...
RUN go build -o /bin/pwd-server .

FROM archlinux:latest AS production-k8s
COPY --from=builder /bin/pwd-server /bin/
CMD ["/bin/pwd-server", "webserver"]
