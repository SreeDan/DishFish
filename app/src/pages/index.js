import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/Layout';
import { Text, Button, VStack, Container, Box } from '@chakra-ui/react'

export default function Home() {
  return (
    <>
      <Layout></Layout>
      <Container background={"#008080"} maxW={'max-content'}>
      <VStack spacing='5'>
        <Box margin="2em">
        <Image width = {200} height = {200} src='/Logo.png'>
        </Image>
        </Box>
        <Text color="white" fontSize='xl' margin={"1em"} paddingBottom={"10"}>
          Simplifying dining by helping users find their perfect dish through AI within budget and dietary preferences while empowering restaurants with data-driven insights and dynamic pricing.
        </Text>

        <Link href='/user/signup'>
          <Button marginBottom={10}>
            Sign Up
          </Button>
        </Link>
      </VStack>
    </Container>
    
    </>
  )
}
