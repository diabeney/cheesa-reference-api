require('dotenv').config()
import https from 'https'
import { Request, Response } from 'express'

const payStack = {
  // Handle Payment Controller (Accept Payment)
  handlePayment: async (req: Request, res: Response) => {
    try {
      const { email, amount } = req.body
      // params from the body
      const params = JSON.stringify({
        email,
        amount: amount * 100
      })
      // options
      const options = {
        hostname: process.env.PAYSTACK_HOST,
        port: process.env.PAYSTACK_PORT,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
      // client request
      const client_request = https
        .request(options, (api_response) => {
          let data = ''
          api_response.on('data', (chunk) => {
            data += chunk
          })
          api_response.on('end', () => {
            console.log(JSON.parse(data))
            return res.status(200).json(data)
          })
        })
        .on('error', (error) => {
          console.error(error)
          return res.status(400).json(error.message)
        })
      client_request.write(params)
      client_request.end()
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  // Verify Payment Controller
  verifyPayment: async (req: Request, res: Response) => {
    const reference = req.params.reference
    try {
      const options = {
        hostname: process.env.PAYSTACK_HOST,
        port: process.env.PAYSTACK_PORT,
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }

      const api_request = https.request(options, (api_response) => {
        let data = ''

        api_response.on('data', (chunk) => {
          data += chunk
        })

        api_response.on('end', () => {
          console.log(JSON.parse(data))
          return res.status(200).json(data)
        })
      })

      api_request.on('error', (error) => {
        console.error(error)
        res.status(500).json({ error: 'An error occurred' })
      })

      // End the request object if there is no error
      api_request.end()
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}

export const { handlePayment, verifyPayment } = payStack
