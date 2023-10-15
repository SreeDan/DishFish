import { useState } from "react";
import { redirect } from 'next/navigation'
import { CookiesProvider, useCookies } from 'react-cookie';
import { useRouter } from 'next/router'
import {
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  FormLabel,
  Box
} from "@chakra-ui/react";

const SignIn = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [cookies, setCookie] = useCookies(["user"])

    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        }

        fetch('http://localhost:8080/api/v1/users/signin', requestOptions)
        .then((response) => {
            if (!response.ok) {
                console.log(`HTTP Response Code: ${response.status}`)
            } else {
                setCookies('token', res.data.token); // your token
                setCookies('name', res.data.name); // optional data

                router.push('/user/home')
            }
        })
    }

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            backgroundColor="gray.200"
            justifyContent="center"
            alignItems="center"
        >
        <Stack
            flexDir="column"
            mb="2"
            justifyContent="center"
            alignItems="center"
        >
        <Heading color="teal.400">Welcome to DishFish</Heading>

        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              textColor={"black"}
              p="1rem"
              backgroundColor="whiteAlpha.900"
            > 
            <FormLabel padding={0} margin={0} color={"blackAlpha.800"}>
                Username
            </FormLabel>
            <Input borderColor={"blackAlpha.400"} color='black' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <FormLabel padding={0} margin={0} color={"blackAlpha.800"}>
                Password
            </FormLabel>
            <Input borderColor={"blackAlpha.400"} type='password' color='black' value={password} onChange={(e) => setPassword(e.target.value)}/>
            {/* <RadioGroup onChange={setRole} value={role} colorScheme="blackAlpha">
                <Stack direction='row'>
                    <Radio value='user' colorScheme='cyan'>
                        User
                    </Radio>
                    <Radio value='rest' border={"black"} colorScheme='cyan'>
                        Restaurant
                    </Radio>
                </Stack>
            </RadioGroup> */}
            
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Sign In 
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignIn;
