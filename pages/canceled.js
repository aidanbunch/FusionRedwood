import React from 'react'
import { Stack, VStack, Heading, Button, Flex, useColorModeValue, Box, Center, Text, Icon } from "@chakra-ui/react"
import { CloseIcon } from '@chakra-ui/icons'
import Footer from '../components/Footer'
import {BsFillXCircleFill} from "react-icons/bs"
import {useRouter} from "next/router"


function Canceled() {
    const router = useRouter()

    const handleClick = () => {

        router.push("/")

    }
    return (
        <Box
            minHeight={{
                base: ["-webkit-fill-available", "fill-available", "-moz-available"],
                lg: "100vh",
            }}
            display="flex"
            flexDirection="column"
        >
             <Flex
          minHeight="70vh"
          alignItems="center"
          justifyContent="center"
          mx={10}
        >
                <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"xl"}
                    bg={useColorModeValue("white", "gray.700")}
                    rounded={"xl"}
                    boxShadow={"xl"}
                    p={10}
                    my={12}
                >
                    <VStack spacing="30px">
                        <Icon as={BsFillXCircleFill} w={50} h={50} color="red"/>
                        <Heading textAlign="center" fontSize="5xl" bgGradient='linear(to-r, red.300, red.600)' backgroundClip="text" >
                            Canceled Payment
                        </Heading>
                        <Text fontWeight={"bold"} fontSize={"2xl"} color="red.400" textAlign="center">Donations help Unpuzzle stay accessible for everyone!</Text>
                        <Button
                            background={'linear-gradient(90deg, #FC8181, #C53030 51%, #FC8181) var(--x, 0)/ 200%'}
                            size="lg"
                            textColor="white"
                            transition="0.5s"
                            _hover={{ "--x": "100%" }}

                            width="200px"
                            onClick={(e) => handleClick(e)}
                        >
                            Back to Home
                        </Button>
                    </VStack>
                </Stack>
                </Flex>
            <Footer/>
            
        </Box>
    )
}

export default Canceled