# Remove the database file (if run multiple times - not in README)

rm db/dev.db 2> /dev/null || true

# Migrations and seeders

npx dotenv sequelize db:migrate

npx dotenv sequelize db:seed:all

echo "----- Tables Exist? -----"
sqlite3 db/dev.db ".schema"
