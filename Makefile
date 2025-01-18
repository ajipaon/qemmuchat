build:
	cd qemmuWeb && yarn build
	ENV=prod go build -buildvcs=false -o ./bin/go-vite ./main.go

dev:
	cd qemmuWeb && yarn dev & air && fg