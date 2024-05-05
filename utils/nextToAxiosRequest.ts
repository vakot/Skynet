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

  return (await axios(axiosConfig)).data
}
