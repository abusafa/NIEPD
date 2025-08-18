import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

const config = buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        delete: () => false,
        update: () => false,
      },
      fields: [],
    },
    {
      slug: 'programs',
      admin: {
        useAsTitle: 'title_en',
      },
      fields: [
        {
          name: 'title_ar',
          type: 'text',
          required: true,
          label: 'Title (Arabic)',
        },
        {
          name: 'title_en',
          type: 'text',
          required: true,
          label: 'Title (English)',
        },
        {
          name: 'category_ar',
          type: 'text',
          required: true,
          label: 'Category (Arabic)',
        },
        {
          name: 'category_en',
          type: 'text',
          required: true,
          label: 'Category (English)',
        },
        {
          name: 'description_ar',
          type: 'textarea',
          required: true,
          label: 'Description (Arabic)',
        },
        {
          name: 'description_en',
          type: 'textarea',
          required: true,
          label: 'Description (English)',
        },
        {
          name: 'duration_hours',
          type: 'number',
          required: true,
          label: 'Duration (Hours)',
        },
        {
          name: 'target_audience_ar',
          type: 'text',
          required: true,
          label: 'Target Audience (Arabic)',
        },
        {
          name: 'target_audience_en',
          type: 'text',
          required: true,
          label: 'Target Audience (English)',
        },
        {
          name: 'prerequisites_ar',
          type: 'text',
          label: 'Prerequisites (Arabic)',
        },
        {
          name: 'prerequisites_en',
          type: 'text',
          label: 'Prerequisites (English)',
        },
        {
          name: 'certification',
          type: 'text',
          label: 'Certification',
        },
        {
          name: 'registration_url',
          type: 'text',
          label: 'Registration URL',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Draft', value: 'draft' },
          ],
          defaultValue: 'active',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'launch_date',
          type: 'date',
          label: 'Launch Date',
        },
        {
          name: 'partner_ar',
          type: 'text',
          label: 'Partner (Arabic)',
        },
        {
          name: 'partner_en',
          type: 'text',
          label: 'Partner (English)',
        },
      ],
    },
    {
      slug: 'news',
      admin: {
        useAsTitle: 'title_en',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'News', value: 'news' },
            { label: 'Event', value: 'event' },
          ],
          defaultValue: 'news',
        },
        {
          name: 'title_ar',
          type: 'text',
          required: true,
          label: 'Title (Arabic)',
        },
        {
          name: 'title_en',
          type: 'text',
          required: true,
          label: 'Title (English)',
        },
        {
          name: 'summary_ar',
          type: 'textarea',
          required: true,
          label: 'Summary (Arabic)',
        },
        {
          name: 'summary_en',
          type: 'textarea',
          required: true,
          label: 'Summary (English)',
        },
        {
          name: 'content_ar',
          type: 'richText',
          editor: lexicalEditor({}),
          required: true,
          label: 'Content (Arabic)',
        },
        {
          name: 'content_en',
          type: 'richText',
          editor: lexicalEditor({}),
          required: true,
          label: 'Content (English)',
        },
        {
          name: 'image_url',
          type: 'text',
          label: 'Image URL',
        },
        {
          name: 'publish_date',
          type: 'date',
          required: true,
          label: 'Publish Date',
        },
        {
          name: 'event_date',
          type: 'date',
          label: 'Event Date',
          admin: {
            condition: (data) => data.type === 'event',
          },
        },
        {
          name: 'event_location_ar',
          type: 'text',
          label: 'Event Location (Arabic)',
          admin: {
            condition: (data) => data.type === 'event',
          },
        },
        {
          name: 'event_location_en',
          type: 'text',
          label: 'Event Location (English)',
          admin: {
            condition: (data) => data.type === 'event',
          },
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'draft',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'category_ar',
          type: 'text',
          label: 'Category (Arabic)',
        },
        {
          name: 'category_en',
          type: 'text',
          label: 'Category (English)',
        },
        {
          name: 'tags_ar',
          type: 'text',
          label: 'Tags (Arabic, semicolon separated)',
        },
        {
          name: 'tags_en',
          type: 'text',
          label: 'Tags (English, semicolon separated)',
        },
      ],
    },
    {
      slug: 'events',
      admin: {
        useAsTitle: 'title_en',
      },
      fields: [
        {
          name: 'title_ar',
          type: 'text',
          required: true,
          label: 'Title (Arabic)',
        },
        {
          name: 'title_en',
          type: 'text',
          required: true,
          label: 'Title (English)',
        },
        {
          name: 'description_ar',
          type: 'richText',
          editor: lexicalEditor({}),
          required: true,
          label: 'Description (Arabic)',
        },
        {
          name: 'description_en',
          type: 'richText',
          editor: lexicalEditor({}),
          required: true,
          label: 'Description (English)',
        },
        {
          name: 'event_date',
          type: 'date',
          required: true,
          label: 'Event Date',
        },
        {
          name: 'location_ar',
          type: 'text',
          required: true,
          label: 'Location (Arabic)',
        },
        {
          name: 'location_en',
          type: 'text',
          required: true,
          label: 'Location (English)',
        },
        {
          name: 'registration_required',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'registration_url',
          type: 'text',
          label: 'Registration URL',
          admin: {
            condition: (data) => data.registration_required,
          },
        },
        {
          name: 'capacity',
          type: 'number',
          label: 'Capacity',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
          defaultValue: 'upcoming',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      slug: 'partners',
      admin: {
        useAsTitle: 'name_en',
      },
      fields: [
        {
          name: 'name_ar',
          type: 'text',
          required: true,
          label: 'Name (Arabic)',
        },
        {
          name: 'name_en',
          type: 'text',
          required: true,
          label: 'Name (English)',
        },
        {
          name: 'description_ar',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'description_en',
          type: 'textarea',
          label: 'Description (English)',
        },
        {
          name: 'logo_url',
          type: 'text',
          label: 'Logo URL',
        },
        {
          name: 'website_url',
          type: 'text',
          label: 'Website URL',
        },
        {
          name: 'partnership_type',
          type: 'select',
          options: [
            { label: 'Strategic', value: 'strategic' },
            { label: 'Academic', value: 'academic' },
            { label: 'Technology', value: 'technology' },
            { label: 'Training', value: 'training' },
          ],
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
  }),
})

export default config
