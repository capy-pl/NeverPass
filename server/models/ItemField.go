package models

import "gorm.io/gorm"

// ItemField represents the field value of a single item in the vault.
type ItemField struct {
	Value             string `gorm:"not null"`
	FieldDefinition   FieldDefinition
	FieldDefinitionID int
	gorm.Model
}
