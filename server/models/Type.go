package models

import "gorm.io/gorm"

// Type represents the item's type.
type Type struct {
	Name             string            `gorm:"unique;not null;uniqueIndex"`
	Default          bool              `gorm:"not null;<-:create"`
	FieldDefinitions []FieldDefinition `gorm:"many2many:type_fields"`
	gorm.Model
}
