package route

import (
	"github.com/DSMdongly/glove/app/route/handler"
	"github.com/labstack/echo"
)

func Socket(ech *echo.Echo) {
	ech.GET("/socket", handler.Socket())
}
