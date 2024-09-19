package main

import (
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"
	"github.com/liamsnow/cs4241-assignment3/models"
)

var db *sql.DB

func ConnectDB() {
	var err error
	db, err = sql.Open("sqlite3", "./db.db")
	if err != nil {
		log.Fatal(err)
	}

	makeTables()
}

func makeTables() {
	// make users table
	_, err := db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
	if err != nil {
		log.Fatal(err)
	}

	// make exercises table
	_, err = db.Exec(`
      CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          name TEXT DEFAULT '',
          form_notes TEXT DEFAULT '',
          setup_notes TEXT DEFAULT '',
          rating INTEGER DEFAULT 3 CHECK(rating >= 1 AND rating <= 5),
          last_weight INTEGER DEFAULT 0,
          created DATETIME DEFAULT CURRENT_TIMESTAMP,
          modified DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)
	if err != nil {
		log.Fatal(err)
	}
}

func MakeUserDB(username, password string) (uint32, error) {
	salt := generateSalt()
	passwordHash := hashPassword(password, salt)

	result, err := db.Exec(`
        INSERT INTO users (username, password_hash, salt)
        VALUES (?, ?, ?)
    `, username, passwordHash, salt)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return uint32(id), nil
}

func GetUsernameDB(userID uint32) (string, error) {
	var username string
	err := db.QueryRow("SELECT username FROM users WHERE id = ?", userID).Scan(&username)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("no user found with ID %d", userID)
		}
		return "", fmt.Errorf("error querying database: %v", err)
	}
	return username, nil
}

func TryLoginDB(username, password string) (bool, uint64, error) {
	var storedHash string
	var salt string
	var userID uint64

	err := db.QueryRow("SELECT id, password_hash, salt FROM users WHERE username = ?", username).Scan(&userID, &storedHash, &salt)
	if err != nil {
		if err == sql.ErrNoRows {
			// not found
			return false, 0, nil
		}
		// database error
		return false, 0, err
	}

	providedHash := hashPassword(password, salt)

	if storedHash == providedHash {
		return true, userID, nil
	}
	return false, 0, nil
}

func generateSalt() string {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		log.Fatal(err)
	}
	return hex.EncodeToString(b)
}

func hashPassword(password, salt string) string {
	hash := sha256.New()
	hash.Write([]byte(password + salt))
	return hex.EncodeToString(hash.Sum(nil))
}

func AddBlankExerciseDB(userID uint32) (uint32, error) {
	result, err := db.Exec(`
        INSERT INTO exercises (user_id)
        VALUES (?)
    `, userID)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return uint32(id), nil
}

func GetExerciseDB(userID uint32, exerciseID uint32) (*models.Exercise, error) {
	row := db.QueryRow(`
		SELECT id, user_id, name, form_notes, setup_notes, rating, last_weight, created, modified
		FROM exercises
		WHERE user_id = ? AND id = ?
	`, userID, exerciseID)

	var e models.Exercise
	err := row.Scan(&e.ID, &e.UserID, &e.Name, &e.FormNotes, &e.SetupNotes, &e.Rating, &e.LastWeight, &e.Created, &e.Modified)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No exercise found
		}
		return nil, err
	}

	return &e, nil
}

func GetAllExercisesForUserDB(userID uint32) ([]models.Exercise, error) {
	rows, err := db.Query(`
        SELECT id, user_id, name, form_notes, setup_notes, rating, last_weight, created, modified
        FROM exercises
        WHERE user_id = ?
    `, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var exercises []models.Exercise
	for rows.Next() {
		var e models.Exercise
		err := rows.Scan(&e.ID, &e.UserID, &e.Name, &e.FormNotes, &e.SetupNotes, &e.Rating, &e.LastWeight, &e.Created, &e.Modified)
		if err != nil {
			return nil, err
		}
		exercises = append(exercises, e)
	}

	return exercises, nil
}

func DeleteExerciseDB(exerciseID, userID uint32) error {
	result, err := db.Exec(`
        DELETE FROM exercises
        WHERE id = ? AND user_id = ?
    `, exerciseID, userID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no exercise found with id %d for user %d", exerciseID, userID)
	}

	return nil
}

func SaveExerciseDB(e *models.Exercise) error {
	_, err := db.Exec(`
        UPDATE exercises
        SET name = ?, form_notes = ?, setup_notes = ?, rating = ?, last_weight = ?, modified = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
    `, &e.Name, &e.FormNotes, &e.SetupNotes, &e.Rating, &e.LastWeight, &e.ID, &e.UserID)

	return err
}
