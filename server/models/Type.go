package models

import (
	"errors"

	"gorm.io/gorm"
)

// Type represents the item's type.
type Type struct {
	Name             string            `gorm:"unique;not null;uniqueIndex"`
	Default          bool              `gorm:"not null;<-:create"`
	FieldDefinitions []FieldDefinition `gorm:"many2many:type_fields"`
	gorm.Model
}

// SelectFieldDefinition selects the index of the field definition based on its name.
func (typeInstance Type) SelectFieldDefinition(name string) (uint, error) {
	for _, fieldDef := range typeInstance.FieldDefinitions {
		if fieldDef.Name == name {
			return fieldDef.ID, nil
		}
	}
	return 0, errors.New("field definition not found")
}
