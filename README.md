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
