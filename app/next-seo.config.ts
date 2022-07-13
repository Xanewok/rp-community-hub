export const title = 'RP Community Hub'
const description = 'Raid Party community-built tools, like multi-wallet claim or CFTI shop'
const url = 'https://roll.party'

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
