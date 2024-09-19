package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/liamsnow/cs4241-assignment3/models"
	"github.com/liamsnow/cs4241-assignment3/views"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// database
	ConnectDB()

	// templ render
	ginHtmlRender := r.HTMLRender
	r.HTMLRender = &HTMLTemplRenderer{FallbackHtmlRenderer: ginHtmlRender}

	// cookies
	store := cookie.NewStore([]byte(secret))
	store.Options(sessions.Options{Path: "/", MaxAge: 86400 * 7, HttpOnly: false})
	r.Use(sessions.Sessions("lell_session", store))

	// statics
	r.Static("/assets", "../assets")

	// public
	r.GET("/login", func(c *gin.Context) {
		x := NewRenderer(c.Request.Context(), http.StatusOK, views.Base(views.Auth(false), false, ""))
		c.Render(http.StatusOK, x)
	})
	r.GET("/signup", func(c *gin.Context) {
		x := NewRenderer(c.Request.Context(), http.StatusOK, views.Base(views.Auth(true), false, ""))
		c.Render(http.StatusOK, x)
	})
	r.POST("/login", PostLogin)
	r.POST("/signup", PostSignup)
	r.POST("/logout", PostLogout)

	// private
	authorized := r.Group("/")
	authorized.Use(AuthRequired)
	{
		authorized.GET("/edit/:id", func(c *gin.Context) {
			username, _ := GetCurrentUsername(c)
			userID, _ := GetCurrentUserID(c)
			exerciseID, err1 := strconv.ParseUint(c.Param("id"), 10, 32)
			exercise, err2 := GetExerciseDB(userID, uint32(exerciseID))
			if err1 != nil || err2 != nil {
				c.Redirect(http.StatusSeeOther, "/")
			} else {
				// c.JSON(http.StatusOK, gin.H{
				// 	"message": fmt.Sprintf("%d, %s",
				//         userID,
				//           username,
				//         ),
				// })
				x := NewRenderer(c.Request.Context(), http.StatusOK, views.Base(views.Edit(exercise), true, username))
				c.Render(http.StatusOK, x)
			}
		})
		authorized.GET("/", func(c *gin.Context) {
			username, _ := GetCurrentUsername(c)
			userID, _ := GetCurrentUserID(c)
			exercises, err := GetAllExercisesForUserDB(userID)
			if err == nil {
				x := NewRenderer(c.Request.Context(), http.StatusOK, views.Base(views.Home(exercises), true, username))
				c.Render(http.StatusOK, x)
			}
		})
		authorized.POST("/edit/:id", func(c *gin.Context) {
			userID, _ := GetCurrentUserID(c)
			exerciseID, _ := strconv.ParseUint(c.Param("id"), 10, 32)

			if c.PostForm("button") == "delete" {
				DeleteExerciseDB(uint32(exerciseID), userID)
				c.Redirect(http.StatusSeeOther, "/")
			} else {
				lastWeight, _ := strconv.ParseInt(c.PostForm("last-weight"), 10, 32)
				rating, _ := strconv.ParseUint(c.PostForm("rating-1"), 10, 8)
				exercise := models.Exercise{
					ID:         uint32(exerciseID),
					UserID:     userID,
					Name:       c.PostForm("name"),
					FormNotes:  c.PostForm("form-notes"),
					SetupNotes: c.PostForm("setup-notes"),
					Rating:     uint8(rating),
					LastWeight: int32(lastWeight),
				}

				SaveExerciseDB(&exercise)
				c.Redirect(http.StatusSeeOther, "/")
			}
		})
		authorized.POST("/add", func(c *gin.Context) {
			userID, _ := GetCurrentUserID(c)
			id, err := AddBlankExerciseDB(userID)
			if err == nil {
				c.Redirect(http.StatusSeeOther, fmt.Sprintf("/edit/%d", id))
			}
		})
	}

	r.Run(":8080")
}
