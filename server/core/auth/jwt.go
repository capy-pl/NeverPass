package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// duration indicates how many days pass before a token expires.
const duration = 7

var secretToken []byte = []byte("my-secret-token")

// IssueSignedToken issues a signed jwt token for users, which last for 1 week.
func IssueSignedToken(account string) string {
	// dur, _ := time.ParseDuration(duration)
	exp := time.Now().Add(time.Hour * 24 * duration).Unix()
	claims := jwt.StandardClaims{
		Audience:  account,
		ExpiresAt: exp,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, _ := token.SignedString(secretToken)
	return ss
}

// ParseToken parses the given jwt token and return the user id.
func ParseToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretToken, nil
	})
	claims, ok := token.Claims.(jwt.MapClaims)
	if err != nil || !token.Valid && !ok {
		return "", errors.New("not a valid token")
	}
	return claims["aud"].(string), nil
}
