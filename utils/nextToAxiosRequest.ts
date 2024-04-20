import axios from 'axios'
import { NextApiRequest } from 'next'

export const nextToAxiosRequest = async (req: NextApiRequest) => {
  const { method, query, body, headers, url } = req

  const axiosUrl = `http://${headers.host?.replace(/:\d+$/, '')}:${
    process.env.CLIENT_PORT ?? 3001
  }${url}`

  const axiosConfig = {
    method,
    url: axiosUrl,
    query,
    data: body,
  }

  try {
    const response = await axios(axiosConfig)
    return response.data
  } catch (error) {
    throw new Error()
  }
}
