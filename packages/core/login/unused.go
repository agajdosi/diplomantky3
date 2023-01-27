func Main(in Request) *http.Response {
	resp := http.Response{
		StatusCode: 200,
		Header:     http.Header{"Content-Type": []string{"application/json"}},
		Body:       io.NopCloser(bytes.NewBufferString(`{"result": "ok"}`))}
	return &resp
}
