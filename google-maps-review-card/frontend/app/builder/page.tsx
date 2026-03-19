import { Metadata } from 'next'
import BuilderClient from './BuilderClient'

export const metadata: Metadata = {
  title: 'Builder — ReviewCard',
  description: 'Build your Google Maps review card for ad creatives. Live preview, PNG export.',
}

export default function BuilderPage() {
  return <BuilderClient />
}
