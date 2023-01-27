package main

import (
	"net/http"
	"os"
)

type Request struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Response struct {
	StatusCode int               `json:"statusCode,omitempty"`
	Headers    map[string]string `json:"headers,omitempty"`
	Body       map[string]string `json:"body,omitempty"`
}

type Headers struct {
	ContentType string `json:"contentType"`
}

func Main(in Request) *Response {
	headers := map[string]string{"ContentType": "application/json"}
	username := in.Username
	password := in.Password
	if !inputsOK(username, password) {
		data := map[string]string{"result": "wrong credentials"}
		response := &Response{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       data}
		return response
	}

	ok := loginFromEnvVars(username, password)
	if !ok {
		return &Response{
			StatusCode: 200,
			Headers:    headers,
			Body:       map[string]string{"result": "wrong credentials"}}
	}

	cookie := generateCookie()
	headers["Set-Cookie"] = cookie.String()
	return &Response{
		StatusCode: 200,
		Headers:    headers,
		Body:       map[string]string{"result": "ok", "cookie": "set"}}
}

func inputsOK(username, password string) bool {
	if username == "" {
		return false
	}
	if password == "" {
		return false
	}
	return true
}

func loginFromEnvVars(username, password string) bool {
	if username != os.Getenv("ADMIN_USERNAME") {
		return false
	}
	if password != os.Getenv("ADMIN_PASSWORD") {
		return false
	}
	return true
}

func generateCookie() http.Cookie {
	cookie := http.Cookie{
		Name:     "exampleCookie",
		Value:    "Hello world!",
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	return cookie
}
