import { GetServerSideProps } from 'next'
import getAllProducts from 'services/products/get-all-products'
import getAllUsers from 'services/users/get-all-users'
import type { ApiContext } from 'types'

const SiteMap = () => null

type SitemapInfo = {
  path: string
  lastmod?: Date
  changefreq:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority: number
}

// 静的に決まっているパスを定義
const StaticPagesInfo: SitemapInfo[] = [
  {
    path: '/',
    changefreq: 'hourly',
    priority: 1.0,
  },
  {
    path: '/search',
    changefreq: 'always',
    priority: 0.5,
  },
  {
    path: '/signin',
    changefreq: 'daily',
    priority: 0.5,
  },
]

// 動的なパスの情報を取得する
const getProductPagesInfo = async (): Promise<SitemapInfo[]> => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  }
  const products = await getAllProducts(context)

  return products.map((product) => ({
    path: `/products/${product.id}`,
    changefreq: 'daily',
    priority: 0.5,
  }))
}

const getUserPagesInfo = async (): Promise<SitemapInfo[]> => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  }
  const users = await getAllUsers(context)

  return users.map((user) => ({
    path: `/users/${user.id}`,
    changefreq: 'daily',
    priority: 0.5,
  }))
}

// 各ページの情報からsitemap.xmlを生成する
const generateSitemapXML = (baseURL: string, sitemapInfo: SitemapInfo[]) => {
  // <url>タグを生成する
  const urls = sitemapInfo.map((info) => {
    const children = Object.entries(info)
      .map(([key, value]) => {
        if (!value) return null

        switch (key) {
          case 'path':
            return `<loc>${baseURL}${value}</loc>`
          case 'lastmod': {
            if (!value) return
            const date = new Date(value)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()

            return `<lastmod>${year}-${month}-${day}</lastmod>`
          }
          default:
            return `<${key}>${value}</${key}>`
        }
      })
      .filter((child) => child !== null)

    return `<url>${children.join('\n')}</url>`
  })

  // 共通のXML部分で包む
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    '\n',
  )}</urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // ベースURLをreqから取得
  const host = req?.headers?.host ?? 'localhost'
  const protocol = req.headers['x-forwarded-proto'] ? 'https' : 'http'
  const base = `${protocol}://${host}`

  // sitemap.xmlに必要なURLを列挙
  const sitemapInfo = [
    ...StaticPagesInfo,
    ...(await getProductPagesInfo()),
    ...(await getUserPagesInfo()),
  ]

  const sitemapXML = generateSitemapXML(base, sitemapInfo)

  // キャッシュを設定し、24時間に1回程度の頻度でXMLを生成するようにする
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemapXML)
  res.end()

  return {
    props: {},
  }
}
export default SiteMap
