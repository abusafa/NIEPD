import { RootPage } from '@payloadcms/next/views'

type Args = {
  params: {
    segments: string[]
  }
  searchParams: { [key: string]: string | string[] }
}

const Page = ({ params, searchParams }: Args) => {
  return <RootPage params={params} searchParams={searchParams} />
}

export default Page
