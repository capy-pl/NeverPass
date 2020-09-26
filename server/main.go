package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/password-management/server/api"
)

func pathLoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.URL)
		next.ServeHTTP(w, r)
	})
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
	})
	api.Register(r)
	http.ListenAndServe(":8080", r)
}
