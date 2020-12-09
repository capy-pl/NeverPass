package middleware

import (
	"net/http"

	"github.com/gorilla/handlers"
)

// CORSMiddleware is a wrapper middleware for gorilla/handlers's cors handler
func CORSMiddleware(next http.Handler) http.Handler {
	return handlers.CORS(
		handlers.AllowedHeaders([]string{"Content-Type"}),
		handlers.AllowedMethods([]string{http.MethodPost, http.MethodGet, http.MethodPut, http.MethodDelete}),
		handlers.AllowedOrigins([]string{"*"}),
	)(next)
}
