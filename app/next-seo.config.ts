export const title = 'Raid Party Marketplace'
const description = 'Spend your hard-earned CFTI tokens on prizes!'
const url = 'https://market.roll.party'

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
