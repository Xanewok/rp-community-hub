export const title = 'Raid Party Tracker'
const description = 'Raid Party Tracker is a tool for monitoring your current CFTI yield.'
const url = 'https://raid.party'

const SEO = {
    title,
    description,
    canonical: url,
    openGraph: {
        type: 'website',
        url,
        title,
        description,
        images: [
            {
                url: `https://raid.party/images/logo.png`,
                alt: title,
                width: 660,
                height: 190
            },
        ]
    },
    twitter: {
        cardType: 'summary_large_image',
        handle: '@oktalize',
        site: '@oktalize'
    },
    additionalLinkTags: [
        {
            rel: 'icon',
            href: '/favicon.png'
        }
    ]
}

export default SEO
