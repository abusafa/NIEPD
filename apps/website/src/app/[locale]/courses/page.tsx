import { redirect } from 'next/navigation'
import { createLocalizedPath } from '@/lib/navigation'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CoursesPage({ params }: Props) {
  const { locale } = await params
  
  // Redirect to programs page for consistency
  redirect(createLocalizedPath('/programs', locale as Locale))
}

