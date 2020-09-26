package account

import (
	"encoding/json"
	"net/http"

	"github.com/password-management/server/db"
	"github.com/password-management/server/models"
	"golang.org/x/crypto/bcrypt"
)

type addAccountPOSTBody struct {
	Account  string
	Password string
}

func addAcountGETHandler(w http.ResponseWriter, r *http.Request) {
	var body addAccountPOSTBody
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&body)
	if err != nil {
		http.Error(w, "", 400)
		return
	}

	if len(body.Account) < 5 || len(body.Password) < 8 {
		http.Error(w, "Error Code: 101", 400)
		return
	}

	if len(body.Account) > 20 || len(body.Password) > 15 {
		http.Error(w, "Error Code: 102", 400)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error Code: 500", 500)
		return
	}

	user := models.User{Account: body.Account, Password: string(hashedPassword)}
	conn := db.Get()
	err = conn.Db.Create(&user).Error
	if err != nil {
		http.Error(w, "Error Code: 103", 400)
		return
	}
	w.WriteHeader(200)
}
