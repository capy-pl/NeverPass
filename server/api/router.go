package api

import (
	"github.com/gorilla/mux"
	"github.com/password-management/server/api/account"
	"github.com/password-management/server/api/auth"
	"github.com/password-management/server/api/item"
	typeapi "github.com/password-management/server/api/type"
)

// Register function registers all subroutes to given router.
func Register(r *mux.Router) {
	s := r.PathPrefix("/api").Subrouter()
	auth.Register(s)
	account.Register(s)
	item.Register(s)
	typeapi.Register(s)
}
