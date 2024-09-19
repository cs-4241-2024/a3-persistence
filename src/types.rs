
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: u32,
    pub username: String,
    pub password_hash: String,
    pub salt: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Exercise {
    pub id: u32,
    pub name: String,
    pub form_notes: String,
    pub setup_notes: String,
    pub rating: u8,
    pub last_weight: u32
}
