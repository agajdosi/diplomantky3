package main

type Request struct {
	Headers string `json:"__ow_headers"`
}

type Response struct {
	StatusCode int               `json:"statusCode,omitempty"`
	Headers    map[string]string `json:"headers,omitempty"`
	Body       map[string]string `json:"body,omitempty"`
}

func Main(args map[string]interface{}) *Response {
	out_headers := map[string]string{"Content-Type": "application/json"}
	in_headers := args["__ow_headers"].(map[string]interface{})
	cookie := in_headers["Cookie"].(string)
	return &Response{
		StatusCode: 200,
		Headers:    out_headers,
		Body: map[string]string{
			"result": "ok",
			"cookie": cookie,
		},
	}
}
