import utils from '@utils/index'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    return res.status(200).json(await utils.nextToAxiosRequest(req))
  } catch (error) {
    return res.status(500).json({ error: 'unexpected server error' })
  }
}
