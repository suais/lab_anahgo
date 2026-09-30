/** 注入 JSON-LD 结构化数据 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // 内容来自构建期常量，不包含用户输入
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
