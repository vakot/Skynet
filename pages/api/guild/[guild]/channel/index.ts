import { nextToAxiosRequest } from '@utils/helpers'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    return res.status(200).json(await nextToAxiosRequest(req))
  } catch (error: any) {
    return res.status(error.response.status).json(error.data)
  }
}
