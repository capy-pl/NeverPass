package user

import (
	"github.com/gorilla/mux"
	"github.com/password-management/server/core/middleware"
)

// Register all auth modules' subroutes to top level router.
func Register(r *mux.Router) {
	sub := r.PathPrefix("/user").Subrouter()
	sub.Use(middleware.LoginRequired)
	sub.HandleFunc("/", viewUserHandler).Methods("GET")
}
