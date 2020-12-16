package models

import "gorm.io/gorm"

// Item represents a single item in the vault.
type Item struct {
	Type      Type        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"type"`
	TypeID    int         `json:"typeId"`
	Creator   User        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"creator"`
	Status    int         `gorm:"default:1;NOT NULL" json:"status"` // 1 stands for available. 0 stands for deleted.
	Values    []ItemField `gorm:"many2many:item_item_fields;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"values"`
	CreatorID int         `gorm:"index" json:"creatorId"`
	gorm.Model
}
