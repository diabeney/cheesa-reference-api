# Reference API

```js
const BASE_URL = "https://domain.com/api/v1"
```

## Auth
### `/signup` 
1. Request
   ```json
     "firstName": "string",
     "lastName": "string",
     "email": "string",
     "role": "lecturer" | "graduate"
     ```
2. Response
   - Successfull - `200 OK - ` `{message: "string"}`
   - Error - `4XX -` `js {message: "error message"}`
