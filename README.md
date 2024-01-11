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

### `POST => /forgot-password`

1. Request

   ```json
      "email": "string"
   ```

2. Response
   - Successful - `200 OK -` `{message: Reset link sent successfully to ${email} with further instructions}`
   - Error - `5XX -` `{message: "error message"}`

### `POST => /reset-password`

1. Request
   ```json
      "password": "string",
   ```
2. Response
   - Successful - `200 OK -` `{message: "Password reset successful"}`
   - Error - `5XX -` `{message: "error message"}`

### `GET => /verify/:token`

1. Request

   - No request body
   - Request parameter - `token` is the token sent to the user's email

2. Response
   - Successful - `200 OK -` `{message: "Account verified successfully"}`
   - Error - `5XX -` `{message: "error message"}`

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
    "role": "lecturer | graduate",
    "isVerified": true | false
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
       role: 'lecturer',
        isVerified: true | false
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
       role: 'graduate',
        isVerified: true | false
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
       role: 'lecturer',
       isVerified: true | false
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
     quantity: number,
     lecturerId: 'string',
     graduateId: 'string',
     programme: 'chemical' | 'petrochemical',
     graduationYear: 'string',
     requests: [
       {
         destination: 'string',
         expectedDate: 'string' | 'Date'
       },
       {
         destination: 'Georgia Tech',
         expectedDate: 'string' | 'Date'
       }
     ]
   }
   ```

2. Response

   - Successful - `200 OK -`

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

   - Successful - `200 OK -`

   ```json
   {
     "id": "string",
     "graduateInfo": {
       "_id": "string",
       "firstName": "Code",
       "lastName": "Concept",
       "email": "example@email.com",
       "referenceNumber": "string",
       "indexNumber": "string"
     },
     "lecturer": {
       "_id": "string",
       "firstName": "Dr. Thanos",
       "lastName": "Doe",
       "email": "example@email.com",
       "referenceNumber": "string"
     },
     "programme": "string",
     "graduationYear": "string",
      "destination": "string",
      "expectedDate": "string | Date",
     "transactionStatus": "pending",
     "createdAt": "2024-01-06T00:09:55.417Z",
     "accepted": "null",
     "status": "not ready"
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

   - Successful - `200 OK -`

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
      destination: string,
      expectedDate: 'string' | 'Date',
     transactionStatus: 'pending' | 'paid'
     status: 'not ready' | 'submitted'
     accepted: 'accepted' | 'declined' | 'null'
   }[]

   const res = {
     results: [
       {
         id: 'string',
         graduateId: {
           _id: 'string',
           referenceNumber: 'string',
           indexNumber: 'string'
         },
         lecturerId: {
           _id: 'string',
           referenceNumber: 'string'
         },
         programme: 'chemical' | 'petrochemical',
         graduationYear: 'string',
          destination: 'string',
             expectedDate: 'string' | 'Date',
         createdAt: '2024-01-06T00:09:55.417Z',
         accepted: 'null',
         transactionStatus: 'pending',
         status: 'not ready'
       },
       {
         id: 'string',
         graduateId: {
           _id: 'string',
           referenceNumber: 'string',
           indexNumber: 'string'
         },
         lecturerId: {
           _id: 'string',
           referenceNumber: 'string'
         },
         programme: 'chemical' | 'petrochemical',
         graduationYear: 'string',
          destination: 'string',
          expectedDate: 'string' | 'Date',
         createdAt: '2024-01-06T00:09:54.873Z',
         accepted: 'null',
         transactionStatus: 'pending',
         status: 'not ready'
       }
     ]
   }
   ```

   - Error - `4XX - {message: "error message here"}`

### `GET => /graduate/:id`

#### _Get references requested by a particular student_

1. Request
   - No request body.
   - Request Parameter - `id` is the graduate's id
2. Response

   - Successful - `200 OK -`

   ```ts
   type Response = {
     id: string
     graduateId: string
     lecturerId: string
     programme: 'chemical' | 'petrochemical'
     graduationYear: string
     referenceNumber: string
     indexNumber: string
     destination: string,
     expectedDate: 'string' | 'Date',
     transactionStatus: 'pending' | 'paid'
     status: 'not ready' | 'submitted'
     accepted: 'accepted' | 'declined' | 'null'
   }[]

   const res = {
     results: [
       {
         id: 'string',
         graduateId: {
           _id: 'string',
           referenceNumber: 'string',
           indexNumber: 'string'
         },
         lecturerId: {
           _id: 'string',
           referenceNumber: 'string'
         },
         programme: 'chemical | petrochemical',
         graduationYear: 'string',
          destination: 'string',
          expectedDate: 'string | Date',
         transactionStatus: 'pending',
         createdAt: '2024-01-06T00:09:55.417Z',
         accepted: 'null',
         status: 'not ready'
       },
       {
         id: '65989a525160cstringeb0c99fe6b7',
         graduateId: {
           _id: 'string',
           referenceNumber: 'string',
           indexNumber: 'string'
         },
         lecturerId: {
           _id: 'string',
           referenceNumber: 'string'
         },
         programme: 'chemical | petrochemical',
         graduationYear: 'string',
          destination: 'string',
          expectedDate: 'string | Date',
         transactionStatus: 'pending',
         createdAt: '2024-01-06T00:09:54.873Z',
         accepted: 'null',
         status: 'not ready'
       }
     ]
   }
   ```

   - Error - `4XX - {message: "error message here"}`

## Payments

### `GET => /`

#### _Get all payments made including the total amounts_

1. Request

   - No request body.

2. Response

   - Successful - `200 OK -`

   ```ts
   export interface Main {
     allPayments: AllPayment[]
     totalAmount: number
   }

   export interface AllPayment {
     _id: string
     userId: string
     amount: number
     createdAt?: Date
     updatedAt?: Date
     __v: number
   }
   ```

   ```json
   {
     "allPayments": [
       {
         "_id": "string",
         "userId": "string",
         "amount": 300,
         "createdAt": "2024-01-04T22:32:45.522Z",
         "updatedAt": "2024-01-04T22:32:45.522Z",
         "__v": 0
       },
       {
         "_id": "string",
         "userId": "string",
         "amount": 120,
         "createdAt": "2024-01-04T22:32:45.522Z",
         "updatedAt": "2024-01-04T22:32:45.522Z",
         "__v": 0
       }
     ],
     "totalAmount": 420
   }
   ```

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

   ```json
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

   ```json
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

### `GET => /:userId`

#### _Get all payments made by a specific user_

1. Request

   - No request body.
   - Request Parameter - `userId` is the user's id

2. Response

   - Successful - `200 OK -`

   ```js
   {
      "payments": [
         {
            "_id": "string",
            "userId": {
               "_id": "string",
               "email": "user@email.com"
            },
            "amount": "number",
            "__v": 0
         }
      ]
   }
