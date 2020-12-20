package typeapi

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/password-management/server/core/auth"
	"github.com/password-management/server/core/db"
	"github.com/password-management/server/core/util"
	"github.com/password-management/server/models"
	"gorm.io/gorm"
)

// user can only view default types or their custom types.
func viewTypesHandler(w http.ResponseWriter, r *http.Request) {
	userID := auth.FetchIDInRequest(r)
	user := models.User{Model: gorm.Model{ID: uint(userID)}}

	conn := db.Get()
	err := conn.DB.
		Preload("Type.FieldDefinitions").
		Find(&user).
		Error

	if err != nil {
		http.Error(w, "Error code: 100", 400)
		return
	}

	var defaultTypes []models.Type
	conn.DB.Where(&models.Type{Default: true}).Preload("FieldDefinitions").Find(&defaultTypes)

	types := append(defaultTypes, user.Type...)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(types)
}

// user can only view default types or their custom types.
func viewTypeHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	typeName, ok := vars["typeName"]
	if !ok {
		http.Error(w, "Not Found.", 404)
		return
	}
	conn := db.Get()
	var typeModel models.Type
	result := conn.DB.Where("name = ?", typeName).Preload("FieldDefinitions").First(&typeModel)
	if result.Error != nil {
		http.Error(w, "Not Found.", 404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(typeModel)
}

type addTypePostBody struct {
	Name             string
	FieldDefinitions []string
}

func addTypeHandler(w http.ResponseWriter, r *http.Request) {
	var body addTypePostBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, "not a valid post body.", 400)
	}

	// every type should have a "name" field definition as default.
	// this is done automatically.
	fieldDefinitions := make([]models.FieldDefinition, 0)

	for _, val := range body.FieldDefinitions {
		if len(val) == 0 {
			continue
		}

		fieldDefinitions = append(fieldDefinitions, models.FieldDefinition{
			VerboseName: val,
			Name:        util.UUID(),
			Encrypted:   true,
		})
	}

	var nameDef models.FieldDefinition

	conn := db.Get()
	conn.DB.Where(&models.FieldDefinition{Name: "name"}).Find(&nameDef)

	// fetch user
	userID := auth.FetchIDInRequest(r)
	user := models.User{Model: gorm.Model{ID: uint(userID)}}
	conn.DB.Find(&user)

	typeInstance := models.Type{
		Name:        util.UUID(),
		VerboseName: body.Name,
		Default:     false,
	}

	err = conn.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&fieldDefinitions).Error; err != nil {
			return err
		}
		if err = tx.Create(&typeInstance).Error; err != nil {
			return err
		}
		err = tx.Model(&typeInstance).
			Association("FieldDefinitions").
			Append(append([]models.FieldDefinition{nameDef}, fieldDefinitions...))

		if err != nil {
			return err
		}
		err = tx.Model(&user).Association("Type").Append(&typeInstance)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		http.Error(w, "can not create type", 400)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(typeInstance)
}
