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
	Body       string            `json:"body,omitempty"`
}

func Main(in Request) *Response {
	if in.Username == "" {
		return &Response{
			StatusCode: http.StatusBadRequest,
			Body:       "missing username"}
	}

	if in.Password == "" {
		return &Response{
			StatusCode: http.StatusBadRequest,
			Body:       "missing password"}
	}

	username_ok := in.Username == os.Getenv("ADMIN_USERNAME")
	password_ok := in.Password == os.Getenv("ADMIN_PASSWORD")
	if username_ok && password_ok {
		return &Response{Body: "Hello ADMIN!"}
	}

	return &Response{
		Headers:    map[string]string{"location": "https://example.com"},
		StatusCode: 302,
	}
}
