package main

import (
	"errors"
	"fmt"
	"net/http"
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

func Main(in Request) (*Response, error) {
	if in.Username == "" {
		return &Response{
			StatusCode: http.StatusBadRequest,
			Body:       "missing username"}, errors.New("no username provided")
	}

	if in.Password == "" {
		return &Response{
			StatusCode: http.StatusBadRequest,
			Body:       "missing password"}, errors.New("no password provided")
	}

	response := &Response{
		Body: fmt.Sprintf("Hello %s %s", in.Username, in.Password),
	}
	return response, nil
}
