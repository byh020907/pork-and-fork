package route

import (
	"github.com/DSMdongly/glove/app/route/handler"
	"github.com/labstack/echo"
)

func Page(ech *echo.Echo) {
	ech.GET("/main", handler.MainPage())
}
