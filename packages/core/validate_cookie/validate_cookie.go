package main

import (
	"strings"
)

type Request struct {
	OwHeaders map[string]interface{} `json:"__ow_headers,omitempty"`
}

type Response struct {
	StatusCode int               `json:"statusCode,omitempty"`
	Headers    map[string]string `json:"headers,omitempty"`
	Body       map[string]string `json:"body,omitempty"`
}

// func Main(args map[string]interface{}) *Response {
func Main(in Request) *Response {
	out_headers := map[string]string{"Content-Type": "application/json"}

	cookieValue, cookieExists := in.OwHeaders["cookie"]
	if !cookieExists {
		return &Response{
			StatusCode: 200,
			Headers:    out_headers,
			Body: map[string]string{
				"result": "cookie not exists",
			},
		}
	}

	cookiePair := strings.Split(cookieValue.(string), "=")
	name := cookiePair[0]
	value := cookiePair[1]

	return &Response{
		StatusCode: 200,
		Headers:    out_headers,
		Body: map[string]string{
			"result":       "ok",
			"cookie_name":  name,
			"cookie_value": value,
		},
	}
}
