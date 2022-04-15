export const title = 'Raid Party Yield collector'
const description = 'Raid Party Yield collector is a tool for batch claiming CFTI yield.'
const url = 'https://collect.roll.party'

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
        handle: '@xanecrypto',
        site: '@xanecrypto'
    },
    additionalLinkTags: [
        {
            rel: 'icon',
            href: '/favicon.png'
        }
    ]
}

export default SEO
