package middleware

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	"github.com/password-management/server/auth"
)

// LoginRequired inspects incoming request to see if it has a valid token.
// If the incoming request has valid token, it will store the user id in the context.
// Else it will write a http 401 status code to response and stop propagating.
func LoginRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenArr := strings.Split(r.Header.Get("Authorization"), " ")
		if len(tokenArr) != 2 {
			http.Error(w, "", 401)
			return
		}
		token := tokenArr[1]
		id, err := auth.ParseToken(token)
		if err != nil {
			http.Error(w, "", 401)
			return
		}

		userID, _ := strconv.ParseUint(id, 10, 64)
		ctx := context.WithValue(r.Context(), auth.UserIDKey("Id"), userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
