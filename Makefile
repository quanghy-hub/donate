.PHONY: all install lint format fix check hooks dev tunnel deploy-cf clean

all: check

install:
	npm install
	npx husky init

lint:
	npm run lint

format:
	npm run format

fix:
	npm run fix

check:
	npm run check

hooks:
	npx husky init
	@echo "npx lint-staged" > .husky/pre-commit
	chmod +x .husky/pre-commit

dev:
	npx -y serve . -p 8080

tunnel:
	npx -y cloudflared tunnel --url http://localhost:8080

deploy-cf:
	npx -y wrangler pages deploy . --project-name=donate-landing

clean:
	rm -rf node_modules
