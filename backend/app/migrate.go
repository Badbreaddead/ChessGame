package app

import (
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

func (a *App) Migrate() {
	driver, err := postgres.WithInstance(a.DB, &postgres.Config{})
	if err != nil {
		log.Println(err)
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://./migrations/",
		"chess", driver)
	if err != nil {
		log.Printf("migration 1 step error: %s", err)
	}
	if err := m.Steps(4); err != nil {
		log.Printf("migration 2 step error: %s", err)
	}
}
