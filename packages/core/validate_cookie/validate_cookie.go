package main

type Request struct {
	Headers string `json:"__ow_headers"`
}

type Response struct {
	StatusCode int               `json:"statusCode,omitempty"`
	Headers    map[string]string `json:"headers,omitempty"`
	Body       map[string]string `json:"body,omitempty"`
}

// func Main(args map[string]interface{}) *Response {
func Main(in Request) *Response {
	out_headers := map[string]string{"Content-Type": "application/json"}

	headers := in.Headers
	return &Response{
		StatusCode: 200,
		Headers:    out_headers,
		Body:       map[string]string{"result": headers},
	}
}
