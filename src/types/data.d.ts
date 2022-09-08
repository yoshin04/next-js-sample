import { directive } from '@babel/types'

// 商品のカテゴリ
export type Category = 'shoes' | 'clothes' | 'book'
// 商品の状態
export type Condition = 'new' | 'used'

// ユーザー
export type User = {
  id: number
  username: string
  displayName: string
  email: string
  profileImageUrl: string
  description: string
}

// 商品
export type Product = {
  id: number
  category: Category
  title: string
  description: string
  imageUrl: string
  blurDataUrl: string
  price: number
  condition: Condition
  owner: User
}

export type ApiContext = {
  apiRootUrl: string
}

/**
 * Responsiveプロパティ
 * CSSプロパティの値をブレークポイントごとに設定できる
 * TはCSSプロパティの値の型
 */
type ResponsiveProp<T> = {
  base?: T // デフォルト
  sm?: T // 640px以上
  md?: T // 768px以上
  lg?: T // 1024px以上
  xl?: T // 1280px以上
}

/**
 * Responsive型はResponsiveプロパティもしくはCSSプロパティの値
 */
type Responsive<T> = T | Responsive<T>
