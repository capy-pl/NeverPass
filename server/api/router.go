package api

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/password-management/server/api/account"
	"github.com/password-management/server/api/auth"
)

// Register function registers all subroutes to given router.
func Register(r *mux.Router) {
	s := r.PathPrefix("/api").Subrouter()
	s.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		fmt.Println("api")
	})
	auth.Register(s)
	account.Register(s)
}
