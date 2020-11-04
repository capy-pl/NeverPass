package auth

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/password-management/server/core/auth"
	"github.com/password-management/server/core/db"
	"github.com/password-management/server/models"
	"golang.org/x/crypto/bcrypt"
)

type loginBody struct {
	Account  string
	Password string
}

type loginResponse struct {
	Token string
}

func authLoginHandler(w http.ResponseWriter, r *http.Request) {
	var body loginBody
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&body)
	if err != nil {
		http.Error(w, "Error code: 100", 400)
		return
	}
	var user models.User
	conn := db.Get()
	if err := conn.DB.Where("account = ?", body.Account).First(&user).Error; err != nil {
		http.Error(w, "", 404)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		http.Error(w, "", 401)
	}
	token := auth.IssueSignedToken(strconv.Itoa(int(user.ID)))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(loginResponse{token})
}
