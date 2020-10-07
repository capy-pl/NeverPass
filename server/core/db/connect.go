package db

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const dbName = "pwdmg"
const dbUsername = "admin"
const dbPwd = "admin"
const port = "5432"

// Connection represent the connection between the application and sql server.
type Connection struct {
	Db *gorm.DB
}

var conn = Connection{}

// Get connection object.
func Get() *Connection {
	return &conn
}

// New function tries to establish a new connection to sql server.
func (conn *Connection) New() {
	dsn := fmt.Sprintf("user=%s password=%s dbname=%s port=%s",
		dbUsername,
		dbPwd,
		dbName,
		port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	conn.Db = db
	if err != nil {
		log.Fatalln("Cannot established connection with database.")
	}
	log.Println("PostgreSQL connection Established.")
	migration()
}

// func (db *Connection) Close() {

// }
