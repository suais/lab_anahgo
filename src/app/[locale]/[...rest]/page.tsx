import { notFound } from 'next/navigation';

/**
 * 兜底路由：语言前缀下任何未匹配的路径都交给 notFound()，
 * 从而渲染本地化的 404 页并返回 404 状态码。
 * 没有这层时，未匹配路径会落到 Next 内置的英文 404 页。
 */
export default function CatchAllPage() {
  notFound();
}
