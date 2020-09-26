package account

import (
	"github.com/gorilla/mux"
)

// Register all auth modules' subroutes to top level router.
func Register(r *mux.Router) {
	s := r.PathPrefix("/account").Subrouter()
	s.HandleFunc("/", addAcountGETHandler).Methods("POST")
}
