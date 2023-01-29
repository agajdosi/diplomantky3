package main

import (
	"net/http"
	"os"
	"time"
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
	secret_token := secret_token()
	expiresAt := time.Now().Add(48 * time.Hour)
	cookie := http.Cookie{
		Name:     "auth_cookie",
		Value:    "Hello world!",
		Path:     "/",
		Expires:  expiresAt,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	return cookie
}

/*
func unusedMain(in Request) *http.Response {
	resp := http.Response{
		StatusCode: 200,
		Header:     http.Header{"Content-Type": []string{"application/json"}},
		Body:       io.NopCloser(bytes.NewBufferString(`{"result": "ok"}`))}
	return &resp
}
*/
