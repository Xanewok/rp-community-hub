import {
  Flex,
  Box,
  Img,
  UnorderedList,
  Text,
  ListItem,
  Button,
} from '@chakra-ui/react'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { useEthers } from '@usedapp/core'
import { useEffect, useMemo, useState } from 'react'
import { useUserHero } from '../../hooks'
import { supabase } from '../../utils/supabaseClient'
import { SideNavLink } from '../SideNavLink'

export const WithNavigation: React.FC = (props) => {
  const { account, library } = useEthers()

  const [name, setName] = useState<string | null>(null)
  useEffect(() => {
    if (account && library) {
      library.lookupAddress(account).then(setName)
    }
  }, [library, account])

  const heroId = useUserHero(account)
  const user = useUser()
  const discordName = useMemo(() => user.user?.user_metadata.name, [user])

  return (
    <Flex flexDirection={['column', 'column', 'row']} h="100vh">
      <Box
        flexShrink={0}
        zIndex={50}
        position="relative"
        overflowY={'scroll'}
        style={{ scrollbarWidth: 'none' }}
        w={[null, null, '25%', '20%']}
        maxW={[null, null, null, '263px']}
        bg="indigo.600"
      >
        <Box
          as="nav"
          w="100%"
          h={[null, null, '100%']}
          bg={['indigo.800', 'indigo.800', 'indigo.600']}
          py={[null, null, 8]}
          px={[null, null, 5]}
          top={0}
        >
          <Flex
            display={[null, null, 'none']}
            h="56px"
            pr="3"
            alignItems="center"
          >
            <Flex alignItems="center" justify="space-between">
              <Box p={2} pt={0}>
                <Box w="48px" h="48px" position="relative">
                  <Box
                    h="3px"
                    w="32px"
                    left="8px"
                    top="17px"
                    bg="indigo.100"
                    position="absolute"
                  ></Box>
                  <Box
                    h="3px"
                    w="32px"
                    left="8px"
                    top="29px"
                    bg="indigo.100"
                    position="absolute"
                  ></Box>
                </Box>
              </Box>
              <Img
                h="32px"
                w={24}
                position="relative"
                style={{ imageRendering: 'pixelated' }}
                src="/logo.png"
              />
              <Img
                justifySelf="right"
                w={12}
                h={12}
                rounded="full"
                src={`https://cdn.raid.party/hero/${heroId}.png`}
              />
            </Flex>
          </Flex>
          <Flex
            w="100%"
            h="100%"
            flexDirection="column"
            display={['none', 'none', 'flex']}
            justify="space-between"
          >
            <Box>
              <Box px={[null, null, 0]} w="66.66667%">
                <Img style={{ imageRendering: 'pixelated' }} src="/logo.png" />
              </Box>
              <UnorderedList
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                overflowX="auto"
                variant="unstyled"
                m={0}
                mt={4}
                p={0}
              >
                <SideNavLink type="raid" />
                <SideNavLink type="wallet" />
                <SideNavLink type="summon" />
                <SideNavLink type="enhance" />
                <SideNavLink type="guild" />
                <ListItem
                  display="block"
                  mx="auto"
                  w="90%"
                  h="1px"
                  my={6}
                  bg="#0f0c1b"
                  boxShadow="
                  0 1px 0 0 #281c49,
                  -1px 0 0 0 #281c49,
                  1px 0 0 0 #281c49
                  "
                />
                <SideNavLink type="market" selected />
                <SideNavLink type="roll" />
                <SideNavLink type="collect" />
              </UnorderedList>
            </Box>

            <Flex mt={5}>
              <Box
                w={16}
                h={16}
                minW="64px"
                mr={3}
                bg="#130f26"
                boxShadow="0 -3px 0 0 #3e2e6c,0 3px 0 0 #3e2e6c,-3px 0 0 0 #3e2e6c,3px 0 0 0 #3e2e6c"
              >
                <Img
                  src={`https://cdn.raid.party/hero/${heroId}.png`}
                  alt="User icon"
                ></Img>
              </Box>
              <Flex flexDirection="column">
                <Text
                  as="span"
                  fontSize="2xl"
                  fontWeight="bold"
                  textColor="white"
                  lineHeight="32px"
                  mt="-8px"
                >
                  {name || 'None'}
                </Text>
                <Text
                  as="span"
                  fontSize="2xl"
                  textColor="#8986a9"
                  lineHeight="32px"
                  mt="-8px"
                >
                  {account && `${account.slice(0, 6)}...${account.slice(-4)}`}
                </Text>
                {discordName && (
                  <Text
                    as="span"
                    display="inline"
                    fontSize="md"
                    textColor="#8986a9"
                    lineHeight="24px"
                    mt="-8px"
                  >
                    {discordName}
                    <Box
                      display="inline-block"
                      ml={2}
                      h="12px"
                      px={1}
                      cursor="pointer"
                      lineHeight={'8px'}
                      ringColor="rgb(59 130 246/0.5)"
                      boxShadow={
                        ' 0 -2px 0 0 #3e2e6c,0 2px 0 0 #2d265a,-2px 0 0 0 #281c49,2px 0 0 0 #281c49,0 0 0 2px #0f0c1b,0 -4px 0 0 #0f0c1b,0 4px 0 0 #0b0915,-4px 0 0 0 #0b0915,4px 0 0 0 #0b0915;'
                      }
                      onClick={async () => {
                        await supabase.auth.signOut()
                        // FIXME: Make UserProvider handle the logged out case
                        // more gracefully and actually handle logging out *sigh*
                        await fetch('/api/auth/logout', { method: 'POST' })
                        location.reload()
                      }}
                    >
                      X
                    </Box>
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
      {props.children}
    </Flex>
  )
}
