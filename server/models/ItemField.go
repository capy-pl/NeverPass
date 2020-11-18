package models

import "gorm.io/gorm"

// ItemField represents the field value of a single item in the vault.
type ItemField struct {
	Value             string          `gorm:"not null"`
	FieldDefinition   FieldDefinition `gorm:"constraints:OnUpdate:CASCADE,OnDelete:SET NULL"`
	FieldDefinitionID int
	gorm.Model
}
