package models

import "gorm.io/gorm"

// FieldDefinition represents a single field of a type.
type FieldDefinition struct {
	Name        string `gorm:"not null" json:"name"`
	VerboseName string `gorm:"not null" json:"verboseName"`
	MaxLength   int    `gorm:"not null;default:500" json:"maxLength"`
	MinLength   int    `gorm:"not null;default:0" json:"minLength"`
	Encrypted   bool   `gorm:"not null" json:"encrypted"`
	gorm.Model
}
