import { redirect } from 'next/navigation'
import { createLocalizedPath } from '@/lib/navigation'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: string, id: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { locale, id } = await params
  
  // Redirect to program detail page for consistency
  redirect(createLocalizedPath(`/programs/${id}`, locale as Locale))
}
