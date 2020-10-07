package auth

import (
	"net/http"
)

// UserIDKey is the key of the user id in the context.
type UserIDKey string

// FetchIDInRequest fetch the user id in the request context and return the
// user id.
func FetchIDInRequest(r *http.Request) uint64 {
	return r.Context().Value(UserIDKey("Id")).(uint64)
}
