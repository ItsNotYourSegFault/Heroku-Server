.PHONY: _pwd_prompt decrypt_serv encrypt_serv

SERVER_FILE=server.js

# 'private' task for echoing instructions
_pwd_prompt:
	@echo "Contact kendaljharland@gmail.com for the password"

# to create server.js
decrypt_server: _pwd_prompt
	openssl des3 -d -in ${SERVER_FILE}.des3 -out ${SERVER_FILE}

encrypt_server: _pwd_prompt
	openssl des3 -in ${SERVER_FILE} -out ${SERVER_FILE}.des3
