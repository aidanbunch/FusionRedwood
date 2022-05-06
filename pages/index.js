import Router from "next/router";
import Head from "next/head";
import React from "react";
import {
  Flex,
  Center,
  Heading,
  Input,
  VStack,
  Button,
  Box,
  Stack,
  useColorModeValue,
  Text,
  chakra,
  HStack,
  Link
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import HorizontalAd from "../components/HorizontalAd";
import Footer from "../components/Footer";

export default function Home() {
  const [userToken, setUserToken] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    Router.push(`/classrooms/${userToken}`);
    setIsLoading(true);
  };

  const onChange = (e) => {
    const { value } = e.target;
    setUserToken(value);
  };

  const sendUserToVideo = (e) => {
    e.preventDefault()

    if (/\bCrOS\b/.test(navigator.userAgent)) {
      window.open("https://www.youtube.com/watch?v=GzPwb-8fPtk", '_blank').focus();
    } else {
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
        // is mac
        window.open("https://www.youtube.com/watch?v=6F0e8noGiNU", '_blank').focus();
      } else {
        // is windows
        window.open("https://www.youtube.com/watch?v=V3pHpqMH098", '_blank').focus();
      }
    }
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
      {/* <Head>
      <script
        id="Adsense-id"
        data-ad-client="ca-pub-4915743237608302"
        async="true"
        strategy="beforeInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />
       </Head>  */}
      <Navbar currentPage={"home"} />
      <Flex minHeight="70vh" alignItems="center" justifyContent="center" mx={10}>
        <VStack>
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={12}>
            <VStack spacing="30px">
              <Heading textAlign="center" fontSize="4xl">
                Type your Edpuzzle User Token
              </Heading>
              <Input
                value={userToken}
                onChange={onChange}
                placeholder="User token"
              />
              <Button
                isLoading={isLoading}
                loadingText="Logging you in..."
                colorScheme="blue"
                size="lg"
                width="200px"
                isDisabled={userToken === "" ? true : false}
                onClick={(e) => handleClick(e)}
              >
                Go
              </Button>
            </VStack>
          </Stack>
          <Text
            color={useColorModeValue("gray.400", "gray.500")}
            fontWeight={"semibold"}
          >
            Need help? <Link onClick={sendUserToVideo} color={"blue.400"}> Watch this</Link>
          </Text>
          <Text
            color={useColorModeValue("gray.400", "gray.500")}
            fontWeight={"semibold"}
          >
            or use our <Link href={"https://www.google.com/"} color={"blue.400"}> Chrome Extension</Link>
          </Text>
        </VStack>
      </Flex>
      <Center>
        <HorizontalAd />
      </Center>
      {/* <Box position="relative" bottom="0" width="100%" height="100px"> */}
      <Footer />
    </Box>
  );
}
