import { ApiContext, User } from 'types'
import { fetcher } from 'utils'

export type SigninParams = {
  username: string
  password: string
}

const signin = async (
  content: ApiContext,
  params: SigninParams,
): Promise<User> => {
  return await fetcher(
    `${content.apiRootUrl.replace(/\/$/g, '')}/auth/signin`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    },
  )
}

export default signin
