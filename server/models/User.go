package models

import "gorm.io/gorm"

// User represents the user model.
type User struct {
	gorm.Model
	Account  string `gorm:"unique;not null" json:"account"`
	Password string `gorm:"not null" json:"password"`
	Pk       string `gorm:"not null" json:"pk"`
	Type     []Type `gorm:"many2many:user_types;constraints:OnUpdate:CASCADE,OnDelete:SET NULL" json:"type"`
}
