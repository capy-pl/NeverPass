package auth

import (
	"github.com/gorilla/mux"
)

// Register all auth modules' subroutes to top level router.
func Register(r *mux.Router) {
	sub := r.PathPrefix("/auth").Subrouter()
	sub.HandleFunc("/login", authLoginHandler).Methods("POST")
}
