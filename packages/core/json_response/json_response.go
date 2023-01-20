package main

import (
	"net/http"
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
		data := map[string]string{"error": "no username provided"}
		return &Response{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       data}
	}

	if in.Password == "" {
		data := map[string]string{"error": "no username provided"}
		return &Response{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       data}
	}

	data := map[string]string{
		"success": "logged in"}
	return &Response{
		StatusCode: 200,
		Headers:    headers,
		Body:       data,
	}
}
