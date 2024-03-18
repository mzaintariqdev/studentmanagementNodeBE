use following command to generate a Jwt Secret key on windows

node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
