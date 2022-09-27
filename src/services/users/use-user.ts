import useSWR from 'swr'
import type { ApiContext, User } from 'types'

export type UseUserProps = {
  id: number
  initial?: User
}

export type UseUser = {
  user?: User
  isLoading: boolean
  isError: boolean
}

/**
 * ユーザーAPI(個別取得)のカスタムフック
 * @param context APIコンテキスト
 * @returns ユーザーとAPI呼び出しの状態
 */
const useUser = (
  context: ApiContext,
  { id, initial }: UseUserProps,
): UseUser => {
  const { data, error } = useSWR<User>(
    `${context.apiRootUrl.replace(/\/$/g, '')}/users/${id}`,
  )

  return {
    user: data ?? initial,
    isLoading: !error && !data,
    isError: !!error,
  }
}

export default useUser
