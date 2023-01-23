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
	if in.Username == "" {
		data := map[string]string{"result": "no username provided"}
		return &Response{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       data}
	}

	if in.Password == "" {
		data := map[string]string{"result": "no username provided"}
		return &Response{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       data}
	}

	username_ok := in.Username == os.Getenv("ADMIN_USERNAME")
	password_ok := in.Password == os.Getenv("ADMIN_PASSWORD")
	if username_ok && password_ok {
		return &Response{
			StatusCode: 200,
			Headers:    headers,
			Body:       map[string]string{"result": "logged in"}}
	}

	return &Response{
		StatusCode: 200,
		Headers:    headers,
		Body:       map[string]string{"result": "wrong credentials"},
	}
}
