package user

import (
	"encoding/json"
	"net/http"

	"github.com/password-management/server/core/auth"
	"github.com/password-management/server/core/db"
	"github.com/password-management/server/models"
)

type viewUserResponseBody struct {
	ID      uint   `json:"id"`
	Pk      string `json:"pk"`
	Account string `json:"account"`
}

func viewUserHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	id := auth.FetchIDInRequest(r)
	conn := db.Get()
	results := conn.DB.Select("ID", "Pk", "Account").First(&user, id)
	if results.Error != nil {
		http.Error(w, "", 404)
		return
	}
	response := viewUserResponseBody{ID: user.ID, Pk: user.Pk, Account: user.Account}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
