package middleware

import (
	"net/http"
	"os"

	"github.com/gorilla/handlers"
)

// LoggingMiddleware is a wrapper middleware for gorilla/handlers's logginghandler
func LoggingMiddleware(next http.Handler) http.Handler {
	return handlers.LoggingHandler(os.Stdout, next)
}
