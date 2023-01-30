package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"os"
	"time"
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
	headers := map[string]string{"Content-Type": "application/json"}
	username := in.Username
	password := in.Password
	if !inputsOK(username, password) {
		data := map[string]string{"result": "no credentials"}
		response := &Response{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       data}
		return response
	}

	ok := loginFromEnvVars(username, password)
	if !ok {
		return &Response{
			StatusCode: 200,
			Headers:    headers,
			Body:       map[string]string{"result": "wrong credentials"}}
	}

	cookie := generateCookie(username)
	headers["Set-Cookie"] = cookie.String()
	return &Response{
		StatusCode: 200,
		Headers:    headers,
		Body:       map[string]string{"result": "ok"}}
}

func inputsOK(username, password string) bool {
	if username == "" {
		return false
	}
	if password == "" {
		return false
	}
	return true
}

func loginFromEnvVars(username, password string) bool {
	if username != os.Getenv("ADMIN_USERNAME") {
		return false
	}
	if password != os.Getenv("ADMIN_PASSWORD") {
		return false
	}
	return true
}

func generateCookie(username string) http.Cookie {
	secret_token, err := Encrypt(username)
	if err != nil {
		panic(err)
	}

	expiresAt := time.Now().Add(48 * time.Hour)
	return http.Cookie{
		Name:     "auth_cookie",
		Value:    secret_token,
		Path:     "/",
		Expires:  expiresAt,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
}

func Encrypt(value string) (string, error) {
	secretKey := getSecret()
	block, err := aes.NewCipher(secretKey)
	if err != nil {
		return "", err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	iv := make([]byte, aesgcm.NonceSize())
	if _, err := rand.Read(iv); err != nil {
		return "", err
	}

	data := []byte(value)
	ciphertext := aesgcm.Seal(iv, iv, data, nil)
	secret := hex.EncodeToString(ciphertext)
	return secret, nil
}

func Decrypt(encryptedKey []byte) ([]byte, error) {
	secretKey := getSecret()
	block, err := aes.NewCipher(secretKey)
	if err != nil {
		return nil, err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	if len(encryptedKey) < aesgcm.NonceSize() {
		panic("Malformed encrypted key")
	}

	return aesgcm.Open(
		nil,
		encryptedKey[:aesgcm.NonceSize()],
		encryptedKey[aesgcm.NonceSize():],
		nil,
	)
}

func getSecret() []byte {
	secret := os.Getenv("SECRET_KEY")
	if secret == "" {
		panic("Error: Must provide a secret key under env variable SECRET_KEY")
	}
	secret_byte, err := hex.DecodeString(secret)
	if err != nil {
		panic(err)
	}

	return secret_byte
}
