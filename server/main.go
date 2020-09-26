package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/password-management/server/api"
	"github.com/password-management/server/db"
	"github.com/password-management/server/middleware"
)

func main() {
	r := mux.NewRouter()

	r.Use(middleware.IncomeTrafficLogger)
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
	})
	api.Register(r)
	conn := db.Get()
	conn.New()
	log.Println("The server starts listening on localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
