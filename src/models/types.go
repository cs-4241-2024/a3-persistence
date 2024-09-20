package models

import "time"

type User struct {
	ID           uint32
	Username     string
	PasswordHash string
	Salt         string
	Created      time.Time
}

type Exercise struct {
	ID         uint32
	UserID     uint32
	Name       string
	FormNotes  string
	SetupNotes string
	Rating     uint8
	LastWeight int32
	Created    time.Time
	Modified   time.Time
}
