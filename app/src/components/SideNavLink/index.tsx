import { ListItem, Link, Text } from '@chakra-ui/react'

const capitalize = (value: string) =>
  value.replace(/^\w/, (c) => c.toUpperCase())

export type LinkType =
  | 'raid'
  | 'wallet'
  | 'summon'
  | 'enhance'
  | 'guild'
  | 'market'

export const SideNavLink = (props: { type: LinkType; selected?: boolean }) => (
  <ListItem display="block" p={1} mt={2}>
    <Link
      px={2}
      h="40px"
      minWidth="148px"
      alignItems="center"
      display="flex"
      color={props.selected ? 'white' : 'rgb(255 255 255/.4)'}
      borderRadius={props.selected ? undefined : '.375rem'}
      _hover={{ bg: props.selected ? '' : 'indigo.700' }}
      href={LINKS[props.type]}
      bg={props.selected ? 'indigo.400' : undefined}
      ringColor="rgb(59 130 246/0.5)"
      boxShadow={
        props.selected
          ? ' 0 -2px 0 0 #3e2e6c,0 2px 0 0 #2d265a,-2px 0 0 0 #281c49,2px 0 0 0 #281c49,0 0 0 2px #0f0c1b,0 -4px 0 0 #0f0c1b,0 4px 0 0 #0b0915,-4px 0 0 0 #0b0915,4px 0 0 0 #0b0915;'
          : ''
      }
    >
      {IMAGES[props.type]}
      <Text
        as="span"
        fontSize="2xl"
        textColor={props.selected ? 'white' : 'rgb(255 255 255/.4)'}
        translateY="-0.5"
        fontWeight="bold"
        lineHeight={10}
        ml={3}
        pb={2}
      >
        {capitalize(props.type)}
      </Text>
    </Link>
  </ListItem>
)

const LINKS: Record<LinkType, string> = {
  raid: 'https://app.raid.party/',
  wallet: 'https://app.raid.party/my-wallet',
  summon: 'https://app.raid.party/summon',
  enhance: 'https://app.raid.party/enhance',
  guild: 'https://app.raid.party/guild',
  market: '/',
}

const IMAGES = {
  raid: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25306 14.8959L6.55442 17.1973L4.10401 18.9573L2.49306 17.3463L4.25306 14.8959Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5542 17.2674C10.6388 17.1828 10.6862 17.0682 10.6864 16.9485C10.6863 16.829 10.6388 16.7143 10.5543 16.6298C9.46633 15.5419 5.90721 11.9827 4.81928 10.8948C4.73473 10.8103 4.62007 10.7627 4.50055 10.7627C4.38087 10.7628 4.26624 10.8103 4.18166 10.8949C3.92736 11.1492 3.57292 11.5036 3.31862 11.7579C3.23403 11.8425 3.18658 11.9571 3.18648 12.0768C3.18649 12.1963 3.23402 12.311 3.31857 12.3955C4.4065 13.4834 7.96562 17.0426 9.05356 18.1305C9.13811 18.215 9.25276 18.2626 9.37228 18.2626C9.49196 18.2625 9.60659 18.215 9.69118 18.1305C9.94548 17.8762 10.2999 17.5217 10.5542 17.2674Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.06309 19.5626C5.23915 19.3866 5.23917 19.1011 5.06312 18.925C4.45404 18.316 3.13147 16.9934 2.5224 16.3843C2.34634 16.2082 2.06086 16.2083 1.8848 16.3843C1.71813 16.551 1.51463 16.7545 1.34796 16.9212C1.1719 17.0972 1.17188 17.3827 1.34793 17.5588C1.95701 18.1678 3.27958 19.4904 3.88865 20.0995C4.06471 20.2755 4.35019 20.2755 4.52625 20.0995C4.69292 19.9328 4.89642 19.7293 5.06309 19.5626Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.9173 7.22249C18.9155 7.35303 18.8574 7.47681 18.7574 7.56111C17.5206 8.60745 9.39959 15.4752 9.39959 15.4752L5.97407 12.0497C5.97407 12.0497 12.8419 3.92873 13.8882 2.69187C13.9725 2.59191 14.0963 2.53382 14.2268 2.53203C14.962 2.52327 17.4692 2.49293 18.5128 2.48016C18.6343 2.47873 18.7512 2.52627 18.8371 2.61218C18.923 2.69809 18.9706 2.81497 18.9691 2.93646C18.9564 3.98015 18.926 6.4873 18.9173 7.22249ZM11.406 11.0111C11.6732 10.7439 11.6733 10.3106 11.406 10.0433C11.1387 9.77604 10.7054 9.77606 10.4382 10.0433C9.43113 11.0503 7.20291 13.2786 7.20291 13.2786L8.17075 14.2464L11.406 11.0111Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4062 10.0437L18.8374 2.61255C18.9233 2.69846 18.9709 2.81534 18.9694 2.93683C18.9567 3.98052 18.9263 6.48767 18.9176 7.22286C18.9158 7.3534 18.8577 7.47718 18.7577 7.56148L9.39987 15.4756L8.17103 14.2468L11.4063 11.0115C11.6735 10.7443 11.6735 10.311 11.4062 10.0437Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  wallet: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2C22 15.0895 21.9105 15 21.8 15H17C15.3431 15 14 13.6569 14 12C14 10.3431 15.3431 9 17 9H21.8C21.9105 9 22 8.91046 22 8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803Z"
        fill="currentColor"
      ></path>
      <path
        d="M18 12C18 12.5523 17.5523 13 17 13C16.4477 13 16 12.5523 16 12C16 11.4477 16.4477 11 17 11C17.5523 11 18 11.4477 18 12Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  summon: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9ZM21 19C21 20.1046 20.1046 21 19 21C17.8954 21 17 20.1046 17 19C17 17.8954 17.8954 17 19 17C20.1046 17 21 17.8954 21 19Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 20C13.0899 20 16 17.0898 16 13.5C16 9.91015 13.0899 7 9.5 7C5.91015 7 3 9.91015 3 13.5C3 17.0898 5.91015 20 9.5 20ZM8 13C8 12.8252 8.09745 12.5668 8.33211 12.3321C8.56676 12.0975 8.82523 12 9 12C9.55228 12 10 11.5523 10 11C10 10.4477 9.55228 10 9 10C8.17477 10 7.43324 10.4025 6.91789 10.9179C6.40255 11.4332 6 12.1748 6 13C6 13.5523 6.44772 14 7 14C7.55228 14 8 13.5523 8 13Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  enhance: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C16.2526 22 20 19 20 15C20 11 17 9 16 8C14.5939 6.5939 14.1521 4.74612 14.0254 3.4746C13.9552 2.77067 13.2759 2.27145 12.6864 2.66243C11.5335 3.42702 9.90375 4.98749 9 8C8.35747 10.1418 9 12 9 12C9 12 8 11.5 7.5 10C7.3353 9.5059 7.11635 8.90329 6.89675 8.31727C6.58071 7.47387 5.44066 7.48134 5.1629 8.33811C4.61497 10.0282 4 12.3031 4 14C4 19 7.74745 22 12 22Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  guild: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.4065 3.31232C10.5998 3.09231 9.50237 0.596959 9.50237 0.596959C9.43822 0.424089 9.32359 0.274724 9.17345 0.168253C9.02331 0.061782 8.84465 0.00315566 8.66081 0.000172681C8.47575 -0.00341714 8.29389 0.0490383 8.13891 0.150572C7.98393 0.252106 7.863 0.397991 7.79186 0.569431C7.78272 0.596932 6.68532 3.09231 0.878548 3.31232C0.642441 3.32157 0.41908 3.42216 0.255355 3.59309C0.0916298 3.76402 0.000272241 3.99198 0.000452003 4.22904V10.229C-0.0192053 12.5245 0.602659 14.7797 1.79552 16.7386C2.98839 18.6976 4.70452 20.282 6.74929 21.3122C7.27038 21.5563 7.80486 21.7705 8.35015 21.9538C8.44402 21.9868 8.54311 22.0024 8.64254 21.9997C8.73822 22.0011 8.8336 21.9887 8.9258 21.963C9.47541 21.7794 10.0131 21.5618 10.5358 21.3113C12.5824 20.2834 14.3001 18.6995 15.4933 16.74C16.6865 14.7805 17.3072 12.5241 17.2846 10.228V4.22815C17.2846 3.99125 17.1931 3.76348 17.0294 3.59275C16.8657 3.42202 16.6425 3.32156 16.4065 3.31232Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  market: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.6315 0C1.4425 0 1.274 0.131 1.209 0.328L0.0550001 3.8335C0.0185628 3.94436 -2.6634e-06 4.06031 2.86589e-10 4.177V5.5715C2.86589e-10 6.36 0.5755 7 1.2855 7C1.9955 7 2.5715 6.36 2.5715 5.5715C2.5715 6.3605 3.147 7 3.857 7C4.567 7 5.143 6.36 5.143 5.5715C5.143 6.3605 5.7185 7 6.4285 7C7.1385 7 7.7135 6.361 7.7145 5.5725C7.7145 6.361 8.29 7 9 7C9.71 7 10.2855 6.36 10.2855 5.5715C10.2855 6.3605 10.8615 7 11.5715 7C12.2815 7 12.8565 6.361 12.857 5.5725C12.8575 6.361 13.433 7 14.143 7C14.853 7 15.4285 6.36 15.4285 5.5715C15.4285 6.3605 16.004 7 16.7145 7C17.4245 7 18 6.36 18 5.5715V4.177C18 4.06031 17.9814 3.94436 17.945 3.8335L16.791 0.3285C16.726 0.131 16.5575 0 16.3685 0H1.6315Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.99878 7.61506V11.5001H0.748779C0.682475 11.5001 0.618887 11.5264 0.572003 11.5733C0.525119 11.6202 0.498779 11.6838 0.498779 11.7501V12.2501C0.498779 12.3164 0.525119 12.38 0.572003 12.4268C0.618887 12.4737 0.682475 12.5001 0.748779 12.5001H17.2488C17.3151 12.5001 17.3787 12.4737 17.4256 12.4268C17.4724 12.38 17.4988 12.3164 17.4988 12.2501V11.7501C17.4988 11.6838 17.4724 11.6202 17.4256 11.5733C17.3787 11.5264 17.3151 11.5001 17.2488 11.5001H15.9988V7.61506C15.7895 7.53165 15.5961 7.41274 15.4273 7.26356C15.2977 7.37788 15.1536 7.47471 14.9988 7.55156V11.5001H2.99878V7.55156C2.84397 7.47471 2.69991 7.37788 2.57028 7.26356C2.40228 7.41106 2.21028 7.53106 1.99878 7.61506ZM14.9988 6.63656C15.0413 6.59406 15.0813 6.54856 15.1188 6.50006H14.9988V6.63656ZM15.7358 6.50006C15.8114 6.598 15.8998 6.68529 15.9988 6.75956V6.50006H15.7358ZM1.99878 6.75956C2.09822 6.68587 2.18676 6.59851 2.26178 6.50006H1.99878V6.75956ZM2.87878 6.50006H2.99878V6.63656C2.95583 6.59374 2.91574 6.54814 2.87878 6.50006ZM1.24878 13.5001C1.18248 13.5001 1.11889 13.5264 1.072 13.5733C1.02512 13.6202 0.998779 13.6838 0.998779 13.7501V17.5001C0.998779 17.6327 1.05146 17.7598 1.14523 17.8536C1.23899 17.9474 1.36617 18.0001 1.49878 18.0001H16.4988C16.6314 18.0001 16.7586 17.9474 16.8523 17.8536C16.9461 17.7598 16.9988 17.6327 16.9988 17.5001V13.7501C16.9988 13.6838 16.9724 13.6202 16.9256 13.5733C16.8787 13.5264 16.8151 13.5001 16.7488 13.5001H1.24878Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25073 10.0002H5.75073C5.8888 10.0002 6.00073 10.1121 6.00073 10.2502V10.4998H6.74852C6.88659 10.4998 6.99852 10.6117 6.99852 10.7498V11.2498C6.99852 11.3878 6.88659 11.4998 6.74852 11.4998H5.76519C5.76041 11.5 5.75558 11.5002 5.75073 11.5002H4.25073C4.11266 11.5002 4.00073 11.3883 4.00073 11.2502V10.2502C4.00073 10.1121 4.11266 10.0002 4.25073 10.0002Z"
        fill="white"
      />
    </svg>
  ),
} as const