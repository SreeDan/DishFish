import Image from 'next/image'
import { Layout } from '../components/Layout';
import { Text, Button, Link, VStack, Container } from '@chakra-ui/react'

export default function Home() {
  return (
    <>
    <Layout />
      <Container background={"#008080"} maxW={'max-content'}>
      <VStack spacing='5'>
        <Text fontWeight={"bold"} padding='10px' color="white" fontSize='6xl'>
          DishFish
        </Text>
        <Text color="white" fontSize='xl' margin={"1em"} paddingBottom={"10"}>
          Simplifying dining by helping users find their perfect dish through AI within budget and dietary preferences while empowering restaurants with data-driven insights and dynamic pricing.
        </Text>

        <Link>
          <Button>
            Sign Up
          </Button>
        </Link>
      </VStack>
    </Container>
      <Link>
        <Button>Sign In</Button>
      </Link>
      
      <Link>
        <Button>Sign Out</Button>
      </Link>
    </>
  )
}
