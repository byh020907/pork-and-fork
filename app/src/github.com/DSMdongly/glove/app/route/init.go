package route

import "github.com/DSMdongly/glove/app"

func Init() {
	Socket(app.Echo)
	Page(app.Echo)
}
