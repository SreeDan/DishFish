import Image from 'next/image'
import { Text, Button, Link, VStack } from '@chakra-ui/react'

export default function Home() {
  return (
    <div>
      <VStack>
        <Text color="white" fontSize='6xl'>
          DishFish
        </Text>
        <Text color="white" fontSize='xl'>
          Simplifying dining by helping users find their perfect dish through AI within budget and dietary preferences while empowering restaurants with data-driven insights and dynamic pricing.
        </Text>
      </VStack>
      <Button>
        <Link>Sign In</Link>
      </Button>
      <Button>
        <Link>Sign Up</Link>
      </Button>
    </div>
  )
}
