package db

import (
	"fmt"
	"log"
	"os"

	"github.com/password-management/server/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var dbHost string = "127.0.0.1"
var dbName string = "pwdmg"
var dbUserName string = "admin"
var dbPwd string = "admin"
var port string = "5432"

func init() {
	if _, hasDbHost := os.LookupEnv("DB_HOSTNAME"); hasDbHost {
		dbHost = os.Getenv("DB_HOSTNAME")
	}

	if _, hasDbName := os.LookupEnv("DB_NAME"); hasDbName {
		dbName = os.Getenv("DB_NAME")
	}

	if _, hasDbUsername := os.LookupEnv("DB_USERNAME"); hasDbUsername {
		dbUserName = os.Getenv("DB_USERNAME")
	}

	if _, hasDbPwd := os.LookupEnv("DB_PWD"); hasDbPwd {
		dbPwd = os.Getenv("DB_PWD")
	}

	if _, hasDbPort := os.LookupEnv("DB_PORT"); hasDbPort {
		port = os.Getenv("DB_PORT")
	}
}

// Connection represent the connection between the application and sql server.
type Connection struct {
	DB *gorm.DB
}

var conn = Connection{}

// New function tries to establish a new connection to sql server.
func (conn *Connection) New() {
	dsn := fmt.Sprintf("user=%s password=%s host=%s dbname=%s port=%s",
		dbUserName,
		dbPwd,
		dbHost,
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

	log.Println("Migrate table: item_fields.")
	err = conn.DB.AutoMigrate(&models.ItemField{})
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

	CleanDB(conn)
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

	log.Println("Drop table: item_fields.")
	err = db.Migrator().DropTable(&models.ItemField{})
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Drop table: item_item_fields.")
	err = db.Migrator().DropTable("item_item_fields")
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
	nameField := models.FieldDefinition{Name: "name", VerboseName: "name", Encrypted: true}
	accountField := models.FieldDefinition{Name: "account", VerboseName: "account", Encrypted: true}
	passwordField := models.FieldDefinition{Name: "password", VerboseName: "password", Encrypted: true}

	passwordsType := models.Type{Name: "password", VerboseName: "password", Default: true}

	DB.Create(&nameField)
	DB.Create(&accountField)
	DB.Create(&passwordField)
	DB.Create(&passwordsType).
		Association("FieldDefinitions").
		Append([]models.FieldDefinition{nameField, accountField, passwordField})

	paymentcardType := models.Type{Name: "paymentcard", VerboseName: "payment card", Default: true}
	numberField := models.FieldDefinition{Name: "number", VerboseName: "card number", Encrypted: true}
	expirationDateField := models.FieldDefinition{Name: "exp", VerboseName: "expiration date", Encrypted: true}
	securitycodeField := models.FieldDefinition{Name: "securitycode", VerboseName: "security code", Encrypted: true}
	DB.Create(&numberField)
	DB.Create(&expirationDateField)
	DB.Create(&securitycodeField)
	DB.Create(&paymentcardType).
		Association("FieldDefinitions").
		Append([]models.FieldDefinition{nameField, numberField, expirationDateField, securitycodeField})

	bankAccountType := models.Type{Name: "bankaccount", VerboseName: "bank account", Default: true}
	accountNumberField := models.FieldDefinition{Name: "accountnumber", VerboseName: "account number", Encrypted: true}
	pincodeField := models.FieldDefinition{Name: "pin", VerboseName: "PIN code", Encrypted: true}
	DB.Create(&accountNumberField)
	DB.Create(&pincodeField)
	DB.Create(&bankAccountType).
		Association("FieldDefinitions").
		Append([]models.FieldDefinition{nameField, accountNumberField, pincodeField})

	return nil
}

// func (db *Connection) Close() {

// }
