require('dotenv').config()
import https from 'https'
import { Request, Response } from 'express'
import { getUserByEmail } from '../db/user'
import { AuthRequest } from '../types/types'
import { ErrorMsg } from '../utils'
import { TOTAL_AMOUNT, STATIC_AMOUNT } from '../constants/constants'
import Payments from '../models/paymentModel'
import Reference from '../models/reference'

const payStack = {
  // Handle Payment Controller (Accept Payment)
  handlePayment: async (req: AuthRequest, res: Response) => {
    const user = req.userPayload
    try {
      /*  Look for user in the database
          and get the email to use for payment
          after they have been authenticated and
          logged in successfully
      */
      if (user) {
        const { email, id } = user
        const foundUser = await getUserByEmail(email)

        if (!foundUser) return res.status(404).json(ErrorMsg(400))

        //Get logged in user email if found
        const { email: logged_in_user_email } = foundUser
        // params from the body

        const params = JSON.stringify({
          email: logged_in_user_email,
          amount: TOTAL_AMOUNT,
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

            api_response.on('end', async () => {
              try {
                  
                  // Find the reference associated with the user and update its transaction status
                 const updatedReference = await Reference.updateOne(
                    { graduateId: id, accepted: 'accepted', transactionStatus: 'pending'},
                    { $set: { transactionStatus: 'paid' } },
                    { new: true }
                  );

                  const newPayment = new Payments({
                    userId: id,
                    amount: STATIC_AMOUNT,
                  })

                  // Save payment to the database
                  await newPayment.save()

                  return res.status(200).json(data)
              
              } catch (error) {
                console.log(error)
                return res.status(400).json(ErrorMsg(400))
              }
            })
          })
          .on('error', (error) => {
            console.error(error)
            return res.status(400).json(ErrorMsg(400))
          })
        client_request.write(params)
        client_request.end()
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error)
      res.status(500).json(ErrorMsg(500))
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
        res.status(500).json(ErrorMsg(500))
      })

      // End the request object if there is no error
      api_request.end()
    } catch (error) {
      console.error(error)
      res.status(500).json(ErrorMsg(500))
    }
  }
}

export const { handlePayment, verifyPayment } = payStack
