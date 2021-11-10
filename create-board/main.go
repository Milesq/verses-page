package main

import (
	_ "embed"
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/milesq/verses-page/create-board/routes"
)

func main() {
	port := "80"
	app := fiber.New()

	if content, err := os.ReadFile("port"); err == nil {
		port = strings.Trim(string(content), "\t\n ")
	}

	addr := fmt.Sprintf("0.0.0.0:%v", port)

	fmt.Println("Listening at ", addr)

	app.Get("/", routes.DrawImage)
	app.Get("/list-templates", routes.ListTemplates)

	app.Listen(addr)
}
