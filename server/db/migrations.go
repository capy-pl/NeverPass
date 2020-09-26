package db

import (
	"log"

	"github.com/password-management/server/models"
)

func migration() {
	conn := Get()
	log.Println("Database migrations start.")
	err := conn.Db.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Database migrations end.")
}
