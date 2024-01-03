# Reference API

```js
const BASE_URL = 'https://domain.com/api/v1'
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
   - Successfull - `201 Created -` `{message: "string"}`
   - Error - `4XX -` `{message: "error message"}`

### `POST => /login`

1. Request

   ```json
     "email": "string",
   "password": "string"
   ```

2. Response
   - Successfull - `200 OK -` `{accessToken: "string"}`
   - Error - `4XX -` `{message: "error message"}`

### `POST => /refresh`

1. Request
   - No request body, uses an `httpOnly` cookie to generate a new access token.
2. Response
   - Successfull - `200 OK -` `{accessToken: "string"}`
   - Error - `4XX - {message: "Not Authorized}`

### The remaining endpoints require authorization field\*\*

```js
// request header
{
"Authorization": "Bearer <token here>"
}
```

## Users

### `GET => /users/me`

#### _Gets the current logged in user info_

1. Request
   - No request body.
2. Response

   - Successfull - `200 OK -`

   ```json
    "id": "string",
    "firstName": "john",
    "lastName": "doe",
    "email": "johndoe@email.com",
    "role": "lecturer | graduate"
   ```

   - Error - `401 - {message: "Not Authorized}`

### `GET => /users`

#### _Gets all users_

1. Request
   - No request body.
2. Response

   - Successfull - `200 OK -`

   ```js
   results: [
     {
       id: 'string',
       firstName: 'john',
       lastName: 'doe',
       email: 'johndoe@email.com',
       role: 'lecturer'
     }
   ]
   ```

   - Error - `4XX - {message: "error message here"}`

### `GET => /users?role=graduate`

#### _Gets all graduates_

1. Request
   - No request body.
2. Response

   - Successfull - `200 OK -`

   ```js
   results: [
     {
       id: 'string',
       firstName: 'john',
       lastName: 'doe',
       email: 'johndoe@email.com',
       role: 'graduate'
     }
   ]
   ```

   - Error - `4XX - {message: "error message here"}`

### `GET => /users?role=lecturer`

#### _Gets all lecturers_

1. Request
   - No request body.
2. Response

   - Successfull - `200 OK -`

   ```js
   results: [
     {
       id: 'string',
       firstName: 'john',
       lastName: 'doe',
       email: 'johndoe@email.com',
       role: 'lecturer'
     }
   ]
   ```

   - Error - `4XX - {message: "error message here"}`

## References

### `POST => /reference`

#### _Create a new reference_

1. Request

   ```js
   const requestPayload = {
     graduateId: 'string',
     lecturerId: 'strinng',
     programme: 'chemical | petrochemical',
     graduationYear: '2022',
     referenceNumber: 'string',
     indexNumber: 'string',
     expectedDate: 'Date as string',
     destination: 'string'
   }
   ```

2. Response

   - Successfull - `200 OK -`

   ```js
   const res = { message: 'Successfully created' }
   ```

   - Error - `4XX - {message: "error message here"}`

### `GET => /reference/:id`

#### _Get a reference by Id to view it_

1. Request

   - No request body
   - Request parameter - `id` is the reference's id

   ```js
   const obj = { id: 'string' }
   ```

2. Response

   - Successfull - `200 OK -`

   ```js
   const res = {
     id: 'string',
     graduateInfo: {
       _id: 'string',
       firstName: 'kwadwo',
       lastName: 'Addo',
       email: 'user@example.com'
     },
     lecturer: {
       _id: 'string',
       firstName: 'Thanos',
       lastName: 'Youndu',
       email: 'user@example.com'
     },
     programme: 'chemical',
     graduationYear: '2024',
     referenceNumber: 'string',
     indexNumber: 'string',
     destination: 'MIT',
     expectedDate: '2023-12-18T16:03:01.219Z',
     transactionStatus: 'pending | paid',
     createdAt: '2023-12-18T20:59:00.945Z',
     accepted: 'null | accepted | declined',
     status: 'not ready | submitted'
   }
   ```

   - Error - `4XX - {message: "error message here"}`

### `POST => /lecturer?refId=<lecturerId>&accepted=<true | false>`

#### _For lectuers to accept or decline requests_

1. Request

   - No request body.
   - Request Query parameters

   ```js
   const params = {
     refId: 'string',
     accepted: 'true' || 'false'
   }
   ```

2. Response

   - Successfull - `200 OK -`

   ```js
   const res = { message: 'Successful' }
   ```

   - Error - `4XX - {message: "error message here"}`

### `GET => /lecturer/:id`

#### _Get references assigned to a particular lecturer_

1. Request
   - No request body.
   - Request Parameter - `id` is the lecturer's id
2. Response

   - Successfull - `200 OK -`

   ```ts
   type Response = {
     id: string
     graduateId: string
     lecturerId: string
     programme: 'chemical' | 'petrochemical'
     graduationYear: string
     referenceNumber: string
     indexNumber: string
     expectedDate: string | Date
     destination: string
     transactionStatus: 'pending' | 'paid'
     status: 'not ready' | 'submitted'
     accepted: 'accepted' | 'declined' | 'null'
   }[]

   const res = {
     results: [
       {
         id: 'string',
         lecturerId: 'string',
         graduateId: 'string',
         programme: 'chemical',
         graduationYear: '2024',
         referenceNumber: 'string',
         indexNumber: 'string',
         destination: 'MIT',
         expectedDate: '2023-12-18T16:03:01.219Z',
         transactionStatus: 'pending | paid',
         createdAt: '2023-12-18T20:59:00.945Z',
         accepted: 'null | accepted | declined',
         status: 'not ready | submitted'
       }
     ]
   }
   ```

   - Error - `4XX - {message: "error message here"}`

### `GET => /graduate/:id`

#### _Get references requested by a particular lecturer_

1. Request
   - No request body.
   - Request Parameter - `id` is the graduate's id
2. Response

   - Successfull - `200 OK -`

   ```ts
   type Response = {
     id: string
     graduateId: string
     lecturerId: string
     programme: 'chemical' | 'petrochemical'
     graduationYear: string
     referenceNumber: string
     indexNumber: string
     expectedDate: string | Date
     destination: string
     transactionStatus: 'pending' | 'paid'
     status: 'not ready' | 'submitted'
     accepted: 'accepted' | 'declined' | 'null'
   }[]

   const res = {
     results: [
       {
         id: 'string',
         lecturerId: 'string',
         graduateId: 'string',
         programme: 'chemical',
         graduationYear: '2024',
         referenceNumber: 'string',
         indexNumber: 'string',
         destination: 'MIT',
         expectedDate: '2023-12-18T16:03:01.219Z',
         transactionStatus: 'pending | paid',
         createdAt: '2023-12-18T20:59:00.945Z',
         accepted: 'null | accepted | declined',
         status: 'not ready | submitted'
       }
     ]
   }
   ```

   - Error - `4XX - {message: "error message here"}`

## Payment

### `POST => /accept-payment`

#### _Accept payments from logged in user_

1. Request
   - `TOTAL AMOUNT` is hard coded
   ```js
   const params = JSON.stringify({
     amount: quantity
       ? quantity * TOTAL_AMOUNT
       : TOTAL_AMOUNT`(quantity is optional)`
   })
   ```
2. Response

   - Successful - `200 OK -`

   ```js
      {
         "status": true,
         "message": "Authorization URL created",
            "data": {
            "authorization_url": "https://checkout.paystack.com/0peioxfhpn",
            "access_code": "0peioxfhpn",
            "reference": "7PVGX8MEk85tgeEpVDtD"
         }
      }
   ```

   - Error - `5XX - {message: "error message here"}`

### `GET => /verify-payment/:reference`

#### _Confirm the status of a transaction_

1. Request
   - No request body
   - Request Query parameters
   ```js
   const params = {
     reference: 'string'
   }
   ```
2. Response

   - Successful - `200 OK -`

   ```js
      {
         "status": true,
         "message": "Verification successful",
         "data": {
            "id": 2009945086,
            "domain": "test",
            "status": "success",
            "reference": "7PVGX8MEk85tgeEpVDtD",
            "amount": 20000,
            "message": null,
            "gateway_response": "Successful",
            "paid_at": "2024-01-03T14:21:32.000Z",
            "created_at": "2024-01-03T14:20:57.000Z",
            "channel": "card",
            "currency": "GHS",
            "ip_address": "100.64.11.35",
            "metadata": "",
            "log": {
               "start_time": 1660054888,
               "time_spent": 4,
               "attempts": 1,
               "errors": 0,
               "success": true,
               "mobile": false,
               "input": [],
               "history": [
               {
                  "type": "action",
                  "message": "Attempted to pay with card",
                  "time": 3
               },
               {
                  "type": "success",
                  "message": "Successfully paid with card",
                  "time": 4
               }
               ]
            },
            "fees": 100,
            "fees_split": null,
            "authorization": {
               "authorization_code": "AUTH_ahisucjkru",
               "bin": "408408",
               "last4": "4081",
               "exp_month": "12",
               "exp_year": "2030",
               "channel": "card",
               "card_type": "visa ",
               "bank": "TEST BANK",
               "country_code": "GHA",
               "brand": "visa",
               "reusable": true,
               "signature": "SIG_yEXu7dLBeqG0kU7g95Ke",
               "account_name": null
            },
            "customer": {
               "id": 89929267,
               "first_name": null,
               "last_name": null,
               "email": "hello@email.com",
               "customer_code": "CUS_i5yosncbl8h2kvc",
               "phone": null,
               "metadata": null,
               "risk_action": "default",
               "international_format_phone": null
            },
            "plan": null,
            "split": {},
            "order_id": null,
            "paidAt": "2024-01-03T14:21:32.000Z",
            "createdAt": "2024-01-03T14:20:57.000Z",
            "requested_amount": 20000,
            "pos_transaction_data": null,
            "source": null,
            "fees_breakdown": null,
            "transaction_date": "2024-01-03T14:20:57.000Z",
            "plan_object": {},
            "subaccount": {}
         }
      }
   ```
