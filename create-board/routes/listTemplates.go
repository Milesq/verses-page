package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func ListTemplates(c *fiber.Ctx) error {
	fmt.Println("das")
	return c.JSON([]string{"template1", "template2", "template3"})
}
