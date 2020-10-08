package models

import "gorm.io/gorm"

// FieldDefinition represents a single field of a type.
type FieldDefinition struct {
	Name      string `gorm:"not null;uniqueIndex"`
	MaxLength int    `gorm:"not null;default:500"`
	MinLength int    `gorm:"not null;default:0"`
	Encrypted bool   `gorm:"not null"`
	gorm.Model
}
