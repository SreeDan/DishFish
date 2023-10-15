import React, { useState, useEffect } from 'react';
import Result from '../../components/Result';

import {
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  FormLabel,
  Box,
  Link
} from "@chakra-ui/react";
import { useRouter } from 'next/router';

const SearchPage = () => {
  const [priceQuery, setPriceQuery] = useState('');
  const [generalQuery, setGeneralQuery] = useState('');
  const [radiusQuery, setRadiusQuery] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [data, setData] = useState()
  const [location, setLocation] = useState({latitude: null, longitude: null})

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
      }, (error) => {
        console.log(error)
      }
    )
  })

  const handlePriceSearch = (e) => {
    setPriceQuery(e.target.value);
  };

  const handleGeneralSearch = (e) => {
    setGeneralQuery(e.target.value);
  };

  const handleRadiusSearch = (e) => {
    setRadiusQuery(e.target.value);
  };

  const router = useRouter()

  const handleSubmit = (e) => {
      e.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          maxDistance: radiusQuery,
          budget: priceQuery,
          query: generalQuery
        })
      }
      fetch('http://localhost:8080/api/v1/users/food/get', requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                console.log(`HTTP Response Code: ${response.status}`)
            } else {
                // setCookies('token', res.data.token); // your token
                // setCookies('name', res.data.name); // optional data
                // router.query = await response.json()
                const res = await response.json()
                setData(res)
                // console.log(res)
                // router.replace({
                //   query: { ...router.query, key: res },
                // });
                // router.push('/user/results')
                setIsFetched(true)

                
            }
      })
  }

  // make form with Chakra UI with price, radius, and search query
  return (
    isFetched ?
    <Result data={data}>
      </Result>
      :
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
    <Heading color="teal.400">Get Fishing!</Heading>
    <Heading color="black.400" fontSize={"1xl"}>Go to:<Link href="/user/nutrition"><Button margin="8px">Nutrition</Button></Link><Link href="/user/prefs"><Button>Preferences</Button></Link><Link href="/user/financial"><Button margin="8px">Finances</Button></Link></Heading>

    <Box minW={{ base: "90%", md: "468px" }}>
      <form onSubmit={handleSubmit}>
        <Stack
          spacing={4}
          textColor={"black"}
          p="1rem"
          backgroundColor="whiteAlpha.900"
        > 
        <FormLabel padding={0} margin={0} color={"blackAlpha.800"}>
            Price
        </FormLabel>
        <Input borderColor={"blackAlpha.400"} type='text' color='black' value={priceQuery} onChange={handlePriceSearch}/>
        <FormLabel padding={0} margin={0} color={"blackAlpha.800"}>
            Radius
        </FormLabel>
        <Input borderColor={"blackAlpha.400"} type='text' color='black' value={radiusQuery} onChange={handleRadiusSearch}/>
        <FormLabel padding={0} margin={0} color={"blackAlpha.800"}>
            General
        </FormLabel>
        <Input borderColor={"blackAlpha.400"} type='text' color='black' value={generalQuery} onChange={handleGeneralSearch}/>
          <Button
            borderRadius={0}
            type="submit"
            variant="solid"
            colorScheme="teal"
            width="full"
          >
            Fish! 
          </Button>
        </Stack>
      </form>
    </Box>
    </Stack>
    </Flex>
);
}

export default SearchPage;