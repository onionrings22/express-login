# login-api
To run the code, execute 'npm start' from the project directory
## endpoints
/sign-up  
consumes: {
	"name": "Russell",
	"email": "123@mail.com",
	"password": "p"
}
  
/sign-in  
consumes: {
	"email": "123@mail.com",
	"password": "p"
}
  
/me  
consumes an Authorization token with the JWT included in the response of /sign-in
