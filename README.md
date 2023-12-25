# Reference API

```js
const BASE_URL = "https://domain.com/api/v1"
```

## Auth
### `POST => /signup` 
1. Request
   ```json
     "firstName": "string",
     "lastName": "string",
   "password": "string",
     "email": "string",
     "role": "lecturer | graduate"
     ```
2. Response
   - Successfull - `201 Created - ` `{message: "string"}`
   - Error - `4XX -` `{message: "error message"}`
     
### `POST => /login` 
1. Request
   ```json
     "email": "string",
   "password": "string"   
     ```
2. Response
   - Successfull - `200 OK - ` `{accessToken: "string"}`
   - Error - `4XX -` `{message: "error message"}`

### `POST => /refresh`
1. Request
   - No request body, uses an `httpOnly` cookie to generate a new access token.
2. Response
   - Successfull - `200 OK - ` `{accessToken: "string"}`
   - Error - `4XX - {message: "Not Authorized}`
     
**The remaining endpoints require  authorization field**

```js
// request header
{
"Authorization": "Bearer <token here>"
}
```

## Users
### `GET => /users/me`
_Gets the current logged in user info_
1. Request
   - No request body.
2. Response
   - Successfull - `200 OK - `
   - ```json
     "id": "string",
     "firstName": "john",
     "lastName": "doe",
     "email": "johndoe@email.com",
     "role": "lecturer | graduate"
     ```
   - Error - `401 - {message: "Not Authorized}`
### `GET => /users`
_Gets all users_
1. Request
   - No request body.
2. Response
   - Successfull - `200 OK - `
   - ```js
     results: [
      {
     "id": "string",
     "firstName": "john",
     "lastName": "doe",
     "email": "johndoe@email.com",
     "role": "lecturer"
     }
     ]
     ```
   - Error - `4XX - {message: "error message here"}`
### `GET => /users?role=graduate`
_Gets all graduates_
1. Request
   - No request body.
2. Response
   - Successfull - `200 OK - `
   - ```js
     
     results: [
     {
     "id": "string",
     "firstName": "john",
     "lastName": "doe",
     "email": "johndoe@email.com",
     "role": "graduate" 
     }]
     ```
   - Error - `4XX - {message: "error message here"}`
### `GET => /users?role=lecturer`
_Gets all lecturers_
1. Request
   - No request body.
2. Response
   - Successfull - `200 OK - `
   - ```js
     results: [
     {
     "id": "string",
     "firstName": "john",
     "lastName": "doe",
     "email": "johndoe@email.com",
     "role": "lecturer" }
     ]
     ```
   - Error - `4XX - {message: "error message here"}`
