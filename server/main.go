package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/password-management/server/api"
	"github.com/password-management/server/core/db"
	"github.com/password-management/server/core/middleware"
	"github.com/password-management/server/core/util"
)

func webserver() {
	var handler http.Handler
	r := mux.NewRouter()
	r.Use(middleware.LoggingMiddleware)

	// http health check path route for k8s.
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
	})

	api.Register(r)
	conn := db.Get()
	conn.New()

	handler = handlers.CORS(
		handlers.AllowedHeaders([]string{"Content-Type"}),
		handlers.AllowedMethods([]string{http.MethodPost, http.MethodGet, http.MethodPut, http.MethodDelete}),
		handlers.AllowedOrigins([]string{"*"}),
	)(r)
	log.Println("The server starts listening on localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func executeCommand(command string) {
	switch command {
	case "webserver":
		webserver()
	case "migrate":
		db.Migrate(nil)
	case "cleandb":
		db.CleanDB(nil)
	case "populate":
		db.Populate(nil)
	case "initdb":
		db.InitDB(nil)
	default:
		fmt.Println("Please provide valid command.")
	}
}

func main() {
	command, err := util.ParseArg()
	if err != nil {
		log.Fatal(err)
	}
	executeCommand(command)
}
