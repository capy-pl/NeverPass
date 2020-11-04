package typeapi

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/password-management/server/core/db"
	"github.com/password-management/server/models"
)

func viewTypesHandler(w http.ResponseWriter, r *http.Request) {
	var types []models.Type
	conn := db.Get()
	result := conn.DB.Preload("FieldDefinitions").Find(&types)
	if result.Error != nil {
		http.Error(w, "Error code: 100", 400)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(types)
}

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
