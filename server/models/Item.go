package models

import "gorm.io/gorm"

// Item represents a single item in the vault.
type Item struct {
	Type      Type
	TypeID    int
	Creator   User
	Values    []ItemField `gorm:"many2many:item_item_fields"`
	CreatorID int         `gorm:"index"`
	gorm.Model
}
