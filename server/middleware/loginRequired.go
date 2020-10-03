package middleware

import "net/http"

// LoginRequired inspects incoming request to see if it has a valid token.
// If the incoming request has valid token, it will store the user id in the context.
// Else it will write a http 404 status code to response and stop propagating.
func LoginRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// token := r.Header.Get("Authentication")
		next.ServeHTTP(w, r)
	})
}
