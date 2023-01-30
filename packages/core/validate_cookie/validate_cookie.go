package main

import "fmt"

type Request struct {
	Headers string `json:"__ow_headers"`
}

type Response struct {
	StatusCode int               `json:"statusCode,omitempty"`
	Headers    map[string]string `json:"headers,omitempty"`
	Body       map[string]string `json:"body,omitempty"`
}

func Main(args map[string]interface{}) *Response {
	fmt.Println("FUNCTION CALLED", args)
	headers := map[string]string{"Content-Type": "application/json"}
	//h := in.Headers
	//fmt.Println(h)
	result := fmt.Sprint(args, args["__ow_headers"])
	return &Response{
		StatusCode: 200,
		Headers:    headers,
		Body:       map[string]string{"result": result},
	}
}
