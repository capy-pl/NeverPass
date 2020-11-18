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
	sub.HandleFunc("/", viewItemsHandler).Methods("GET")
	sub.HandleFunc("/{id}", viewItemHandler).Methods("GET")
	sub.HandleFunc("/{id}", updateItemHandler).Methods("PUT")
	sub.HandleFunc("/{id}", deleteItemHandler).Methods("DELETE")
}
