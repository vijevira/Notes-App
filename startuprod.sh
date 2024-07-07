export DB_TYPE=POSTGRESQL
export DB_USER=admin
export DB_NAME=notesapp
export PGSSLMODE=require
export DB_PORT=5432
export PORT=3000
npm run migrate
npm start
