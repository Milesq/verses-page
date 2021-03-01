package main

import "encoding/base64"

func b64(str string) string {
	return base64.StdEncoding.EncodeToString([]byte(str))
}
