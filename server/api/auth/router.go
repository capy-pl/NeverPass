package auth

import (
	"github.com/gorilla/mux"
)

// Register all auth modules' subroutes to top level router.
func Register(r *mux.Router) {
	s := r.PathPrefix("/auth").Subrouter()
	s.HandleFunc("/login", authLoginHandler).Methods("POST")
}
