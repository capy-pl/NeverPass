package item

import (
	"github.com/gorilla/mux"
	"github.com/password-management/server/core/middleware"
)

// Register all auth modules' subroutes to top level router.
func Register(r *mux.Router) {
	sub := r.PathPrefix("/item").Subrouter()
	sub.Use(middleware.LoginRequired)
	sub.HandleFunc("/", addItemHandler).Methods("POST")
	sub.HandleFunc("/", viewItemHandler).Methods("GET")
}
