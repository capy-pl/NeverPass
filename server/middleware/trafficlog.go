package middleware

import (
	"log"
	"net/http"
)

// IncomeTrafficLogger logs information about income traffic.
func IncomeTrafficLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		log.Printf("%s - \"%s %s\" %s \n", r.RemoteAddr, r.Method, r.URL.String(),
			r.Header.Get("User-Agent"))
		next.ServeHTTP(w, r)
	})
}

// IncomeTrafficLogger logs information about income traffic.
// func OutboundTrafficLogger(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		log.Printf("%s - \"%s %s\" %s \n", w.Header().Get, r.RemoteAddr, r.Method, r.URL.String(),
// 			r.Header.Get("User-Agent"))
// 		next.ServeHTTP(w, r)
// 	})
// }
