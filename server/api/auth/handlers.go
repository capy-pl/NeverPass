package auth

import (
	"fmt"
	"net/http"
)

func authAcountPOSTHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
	fmt.Println("Add account")
}

func authAcountGETHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
	fmt.Println("View account")
}
