package util

import (
	"errors"
	"os"
)

// ParseArg parses the current command.
func ParseArg() (string, error) {
	if !(len(os.Args) > 1) {
		return "", errors.New("not enough argument")
	}
	return os.Args[1], nil
}

// func ParseFlagArg() {

// }
