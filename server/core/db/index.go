package db

import (
	"fmt"
	"log"

	"github.com/password-management/server/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const dbName = "pwdmg"
const dbUsername = "admin"
const dbPwd = "admin"
const port = "5432"

// Connection represent the connection between the application and sql server.
type Connection struct {
	DB *gorm.DB
}

var conn = Connection{}

// New function tries to establish a new connection to sql server.
func (conn *Connection) New() {
	dsn := fmt.Sprintf("user=%s password=%s dbname=%s port=%s",
		dbUsername,
		dbPwd,
		dbName,
		port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	conn.DB = db
	if err != nil {
		log.Fatalln("Cannot established connection with database.")
	}
	log.Println("PostgreSQL connection Established.")
}

// Get connection object.
func Get() *Connection {
	return &conn
}

// Migrate migrates the db to its latest schema.
func Migrate(conn *Connection) {
	if conn == nil {
		log.Println("No connection found. Try to establish a connection.")
		conn = Get()
		conn.New()
	}

	log.Println("Database migrations start.")

	log.Println("Migrate table: users.")
	err := conn.DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Migrate table: field_definitions.")
	err = conn.DB.AutoMigrate(&models.FieldDefinition{})
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Migrate table: types.")
	err = conn.DB.AutoMigrate(&models.Type{})
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Migrate table: items.")
	err = conn.DB.AutoMigrate(&models.Item{})
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Database migrations end.")
}

// InitDB runs the following function
// 1. CleanDB (drops all datatable)
// 2. Migrate
// 3. Populate (Populate default data)
func InitDB(conn *Connection) error {
	if conn == nil {
		conn = Get()
		conn.New()
	}

	Migrate(conn)
	Populate(conn)
	return nil
}

// CleanDB clears the entire database.
func CleanDB(conn *Connection) error {
	log.Println("Start cleaning database.")
	if conn == nil {
		log.Println("No connection found. Try to establish a connection.")
		conn = Get()
		conn.New()
	}

	db := conn.DB

	log.Println("Drop table: users.")
	err := db.Migrator().DropTable(&models.User{})
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Drop table: field_definitions.")
	err = db.Migrator().DropTable(&models.FieldDefinition{})
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Drop table: type_fields.")
	err = db.Migrator().DropTable("type_fields")
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Drop table: types.")
	err = db.Migrator().DropTable(&models.Type{})
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Drop table: items.")
	err = db.Migrator().DropTable(&models.Item{})
	if err != nil {
		log.Fatal(err)
	}

	return nil
}

// Populate default configuration into database.
func Populate(conn *Connection) error {
	if conn == nil {
		log.Println("No connection found. Try to establish a connection.")
		conn = Get()
		conn.New()
	}

	DB := conn.DB

	// Create some basic field_definitions.
	nameField := models.FieldDefinition{Name: "name", Encrypted: true}
	accountField := models.FieldDefinition{Name: "account", Encrypted: true}
	passwordField := models.FieldDefinition{Name: "password", Encrypted: true}

	passwordsType := models.Type{Name: "passwords", Default: true}

	DB.Create(&nameField)
	DB.Create(&accountField)
	DB.Create(&passwordField)
	DB.Create(&passwordsType).
		Association("FieldDefinitions").
		Append([]models.FieldDefinition{nameField, accountField, passwordField})

	return nil
}

// func (db *Connection) Close() {

// }
