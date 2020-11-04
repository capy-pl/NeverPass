package typeapi

import (
	"github.com/gorilla/mux"
	"github.com/password-management/server/core/middleware"
)

// Register all auth modules' subroutes to top level router.
func Register(r *mux.Router) {
	sub := r.PathPrefix("/type").Subrouter()
	sub.Use(middleware.LoginRequired)
	sub.HandleFunc("/", viewTypesHandler).Methods("GET")
	sub.HandleFunc("/{typeName}/", viewTypeHandler).Methods("GET")
}
