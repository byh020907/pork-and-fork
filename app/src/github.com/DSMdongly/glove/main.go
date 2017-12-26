package main

import (
	"log"

	"github.com/DSMdongly/glove/app"
	"github.com/DSMdongly/glove/app/model"
	"github.com/DSMdongly/glove/app/route"
	"github.com/DSMdongly/glove/config"
	"github.com/DSMdongly/glove/socket"
)

func main() {
	config.Init()
	socket.Init()

	if err := model.Init(); err != nil {
		log.Fatal(err)
	}

	app.Init()
	route.Init()

	app.Start()
}
