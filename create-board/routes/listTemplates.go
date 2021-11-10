package routes

import (
	"github.com/gofiber/fiber/v2"
)

func ListTemplates(c *fiber.Ctx) error {
	return c.JSON([]string{"template1", "template2", "template3"})
}
