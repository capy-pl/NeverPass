build:
	go build -o bin/main server/main.go
run:
	go run ./server/main.go webserver
migrate:
	go run ./server/main.go migrate
cleandb:
	go run ./server/main.go cleandb
populate:
	go run ./server/main.go populate
initdb:
	go run ./server/main.go initdb
clean:
	rm bin/*
