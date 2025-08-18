import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

async function importData() {
  const payload = await getPayload({ config })

  try {
    // Import Programs
    const programsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '../../data/programs.json'), 'utf-8')
    )

    console.log('Importing programs...')
    for (const program of programsData) {
      await payload.create({
        collection: 'programs',
        data: {
          title_ar: program.title_ar,
          title_en: program.title_en,
          category_ar: program.category_ar,
          category_en: program.category_en,
          description_ar: program.description_ar,
          description_en: program.description_en,
          duration_hours: program.duration_hours,
          target_audience_ar: program.target_audience_ar,
          target_audience_en: program.target_audience_en,
          prerequisites_ar: program.prerequisites_ar,
          prerequisites_en: program.prerequisites_en,
          certification: program.certification,
          registration_url: program.registration_url,
          status: program.status,
          featured: program.featured,
          launch_date: program.launch_date,
          partner_ar: program.partner_ar,
          partner_en: program.partner_en,
        },
      })
    }
    console.log(`Imported ${programsData.length} programs`)

    // Import News
    const newsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '../../data/news.json'), 'utf-8')
    )

    console.log('Importing news...')
    for (const newsItem of newsData) {
      await payload.create({
        collection: 'news',
        data: {
          type: newsItem.type,
          title_ar: newsItem.title_ar,
          title_en: newsItem.title_en,
          summary_ar: newsItem.summary_ar,
          summary_en: newsItem.summary_en,
          content_ar: newsItem.content_ar,
          content_en: newsItem.content_en,
          image_url: newsItem.image_url,
          publish_date: newsItem.publish_date,
          event_date: newsItem.event_date,
          event_location_ar: newsItem.event_location_ar,
          event_location_en: newsItem.event_location_en,
          status: newsItem.status,
          featured: newsItem.featured,
          category_ar: newsItem.category_ar,
          category_en: newsItem.category_en,
          tags_ar: newsItem.tags_ar,
          tags_en: newsItem.tags_en,
        },
      })
    }
    console.log(`Imported ${newsData.length} news items`)

    // Import Partners
    const partnersData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '../../data/partners.json'), 'utf-8')
    )

    console.log('Importing partners...')
    for (const partner of partnersData) {
      await payload.create({
        collection: 'partners',
        data: {
          name_ar: partner.name_ar,
          name_en: partner.name_en,
          description_ar: partner.description_ar,
          description_en: partner.description_en,
          logo_url: partner.logo_url,
          website_url: partner.website_url,
          partnership_type: partner.partnership_type,
          active: partner.active,
        },
      })
    }
    console.log(`Imported ${partnersData.length} partners`)

    console.log('Data import completed successfully!')
  } catch (error) {
    console.error('Error importing data:', error)
  } finally {
    process.exit(0)
  }
}

importData()
