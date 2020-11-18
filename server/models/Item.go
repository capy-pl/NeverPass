package models

import "gorm.io/gorm"

// Item represents a single item in the vault.
type Item struct {
	Type      Type `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	TypeID    int
	Creator   User        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Status    int         `gorm:"default:1"` // 1 stands for available. 0 stands for deleted.
	Values    []ItemField `gorm:"many2many:item_item_fields;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CreatorID int         `gorm:"index"`
	gorm.Model
}
