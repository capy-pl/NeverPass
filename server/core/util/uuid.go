package util

import "github.com/google/uuid"

// UUID generate a random uuid string
func UUID() string {
	uuid, _ := uuid.NewRandom()
	return uuid.String()
}
