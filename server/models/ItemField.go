package models

import "gorm.io/gorm"

// ItemField represents the field value of a single item in the vault.
type ItemField struct {
	Value             string          `gorm:"not null" json:"value"`
	FieldDefinition   FieldDefinition `gorm:"constraints:OnUpdate:CASCADE,OnDelete:SET NULL" json:"fieldDefinition"`
	FieldDefinitionID int             `json:"fieldDefinitionId"`
	gorm.Model
}
