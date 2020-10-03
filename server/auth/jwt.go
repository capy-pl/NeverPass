package auth

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

var secretToken []byte = []byte("my-secret-token")
var duration string = "7d"

// IssueSignedToken issues a signed jwt token for users, which last for 1 week.
func IssueSignedToken(account string) string {
	dur, _ := time.ParseDuration(duration)
	exp := time.Now().Add(dur).Unix()
	claims := jwt.StandardClaims{
		Audience:  account,
		ExpiresAt: exp,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, _ := token.SignedString(secretToken)
	return ss
}
