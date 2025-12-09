import { getNewsBySlug } from '@/actions/public/all-news/all-news';
import { DetailNews } from '@/features/pages/news/detail-news';

export default async function ArticleDetailPage({ params }) {
  const slug = (await params).slug;
  const articleData = await getNewsBySlug(slug);
  return (
    <DetailNews articleData={articleData} />
  )
}