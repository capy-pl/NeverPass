package item

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/password-management/server/core/auth"
	"github.com/password-management/server/core/db"
	"github.com/password-management/server/models"
)

type addItemRequestBody struct {
	TypeID int
	Fields map[string]string
}

func addItemHandler(w http.ResponseWriter, r *http.Request) {
	var body addItemRequestBody
	var typeInstance models.Type
	id := auth.FetchIDInRequest(r)
	conn := db.Get()
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, "error code: 200", 400)
		return
	}

	result := conn.DB.Preload("FieldDefinitions").First(&typeInstance, body.TypeID)
	if result.Error != nil {
		http.Error(w, "error code: 201", 400)
		return
	}

	var fields []models.ItemField
	for key, value := range body.Fields {
		id, err := typeInstance.SelectFieldDefinition(key)
		if err == nil {
			fields = append(fields, models.ItemField{Value: value, FieldDefinitionID: int(id)})
		}
	}
	item := models.Item{
		TypeID:    int(typeInstance.ID),
		CreatorID: int(id),
		Values:    fields,
	}
	result = conn.DB.Create(&item)
	if result.Error != nil {
		http.Error(w, "", 400)
		return
	}
}

// View items.
// query args
// 	1. limit(default 50): how many items should be returned.
func viewItemsHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		http.Error(w, "", 400)
		return
	}

	limit, err := strconv.Atoi(r.FormValue("limit"))

	if err != nil {
		limit = 50
	}

	var items []models.Item
	userID := auth.FetchIDInRequest(r)
	conn := db.Get()
	result := conn.DB.
		Omit("Creator").
		Limit(limit).
		Preload("Type").
		Preload("Values").
		Find(&items, "creator_id = ?", userID)

	if result.Error != nil {
		http.Error(w, "", 400)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func viewItemHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	itemIDStr, ok := vars["id"]
	if !ok {
		http.Error(w, "", 400)
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		http.Error(w, "", 400)
		return
	}

	userID := auth.FetchIDInRequest(r)
	conn := db.Get()
	var item models.Item
	result := conn.DB.
		Preload("Type").
		Preload("Values").
		Take(&item, "creator_id = ? AND id = ?", userID, itemID)

	if result.Error != nil {
		http.Error(w, "", 400)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}
