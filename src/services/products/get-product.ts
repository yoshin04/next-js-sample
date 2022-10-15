import { ApiContext, Product } from '../../types/data'
import { fetcher } from 'utils'

export type GetProductParams = {
  id: number
}

const getProduct = async (
  context: ApiContext,
  { id }: GetProductParams,
): Promise<Product> => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/products/${id}`,
    {
      headers: {
        Origin: '*',
        Accept: 'application/json',
        'Context-Type': 'application/json',
      },
    },
  )
}

export default getProduct
