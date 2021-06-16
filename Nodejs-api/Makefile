
sequelize-auto:
	./node_modules/.bin/sequelize-auto -o "./src/models" -d eagleeye -h localhost -u root -p 3306  -e mysql
eslint-models:
	./node_modules/.bin/eslint src/models --fix

models: sequelize-auto eslint-models
	