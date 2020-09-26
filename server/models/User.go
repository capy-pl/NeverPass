package models

import "gorm.io/gorm"

// User represents the user model.
type User struct {
	gorm.Model
	Account  string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
}
