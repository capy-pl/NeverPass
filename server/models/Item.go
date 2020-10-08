package models

import "gorm.io/gorm"

// Item represents a single item in the vault.
type Item struct {
	Name      string `gorm:"unique;not null;uniqueIndex"`
	Type      Type
	TypeID    int
	Creator   User
	CreatorID int `gorm:"index"`
	gorm.Model
}
