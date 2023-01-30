package main

type Request struct {
	Cookie string `json:"__ow_headers.cookie"`
}

type Response struct {
	StatusCode int               `json:"statusCode,omitempty"`
	Headers    map[string]string `json:"headers,omitempty"`
	Body       map[string]string `json:"body,omitempty"`
}

// func Main(args map[string]interface{}) *Response {
func Main(in Request) *Response {
	headers := map[string]string{"Content-Type": "application/json"}
	//h := in.Headers
	//fmt.Println(h)
	cookie := in.Cookie
	return &Response{
		StatusCode: 200,
		Headers:    headers,
		Body:       map[string]string{"result": cookie},
	}
}
