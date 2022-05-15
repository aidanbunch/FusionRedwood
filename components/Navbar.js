import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useColorMode,
  useBreakpointValue,
  useDisclosure,
  Image,
  Link,
  Avatar,
  useToast,
  Menu,
  MenuList,
  MenuButton,
  Center,
  MenuDivider,
  MenuItem,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
} from "@chakra-ui/icons";
import { useUser } from "../context/user";

import Router from "next/router";

export default function WithSubnavigation({ currentPage }) {
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useUser();

  const goToHome = (event) => {
    Router.push("/");
  };

  function signoutToast() {
    toast({
      title: "Signed out successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }

  const goToSignUp = (event) => {
    Router.push("/signup");
  };
  console.log(user);

  const goToLogin = (event) => {
    Router.push("/login");
  };

  return (
    <Box justifyContent="center">
      <Flex
        alignItems="center"
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"90px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          alignItems="center"
          flex={{ base: 2 }}
          justify={{ base: "center", md: "start" }}
        >
          <Image
            // m={1}s
            onClick={goToHome}
            mx={3}
            boxSize={"40px"}
            align="center"
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            src="/logo.png"
            aria-label="logo"
          />

          <Text
            onClick={goToHome}
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            fontSize={"3xl"}
            fontWeight="bold"
            color={useColorModeValue("blue.500", "white")}
          >
            unpuzzle
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <IconButton
            display={{ base: "block" }}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            isRound="true"
            size="lg"
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
          />
          {user == null ? (
            <Stack
              display={{ base: "none", md: "inline-flex" }}
              align="center"
              direction="row"
              onClick={goToLogin}
            >
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"orange.400"}
                _hover={{
                  bg: "orange.300",
                }}
              >
                Log in
              </Button>
            </Stack>
          ) : (
            <Stack
              display={{ base: "none", md: "inline-flex" }}
              align="center"
              direction="row"
            >
              {/* <Avatar
                bg="teal.500"
                color={"white"}
                src={user.user_metadata.avatar_url}
                name={user.user_metadata.name}
              /> */}
              <Menu>
                <MenuButton
                  as={Avatar}
                  size={"md"}
                  src={user.user_metadata.avatar_url}
                ></MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar size={"2xl"} src={user.user_metadata.avatar_url} />
                  </Center>
                  <br />
                  <Center>
                    <p>{user.user_metadata.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem
                    onClick={() => {
                      signoutToast();
                      logout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map(
        (navItem) =>
          navItem.label !== "Sign up" &&
          navItem.label !== "Login" && (
            <Box key={navItem.label}>
              <Popover trigger={"hover"} placement={"bottom-start"}>
                <PopoverTrigger>
                  <Link
                    p={2}
                    href={navItem.href ?? "#"}
                    fontSize={"sm"}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                      textDecoration: "none",
                      color: linkHoverColor,
                    }}
                  >
                    {navItem.label}
                  </Link>
                </PopoverTrigger>

                {navItem.children && (
                  <PopoverContent
                    border={0}
                    boxShadow={"xl"}
                    bg={popoverContentBgColor}
                    p={4}
                    rounded={"xl"}
                    minW={"sm"}
                  >
                    <Stack>
                      {navItem.children.map((child) => (
                        <DesktopSubNav key={child.label} {...child} />
                      ))}
                    </Stack>
                  </PopoverContent>
                )}
              </Popover>
            </Box>
          )
      )}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      target={label === "Google Chrome Extension" ? "_blank" : "_self"}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("blue.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "blue.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"blue.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { user } = useUser();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={
          label === "Login"
            ? user == null
              ? "/login"
              : "/logout"
            : href ?? "#"
        }
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label === "Login" ? (user == null ? "Login" : "Logout") : label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                py={2}
                href={child.href}
                target={
                  child.label === "Google Chrome Extension" ? "_blank" : "_self"
                }
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    children: [
      {
        label: "Landing page",
        subLabel: "Learn about what we do!",
        href: "/?noredirect=true",
      },
      {
        label: "Google Chrome Extension",
        subLabel: "Even easier",
        href: "https://chrome.google.com/webstore/detail/unpuzzle/bkhmfdnoifikoinnhgbalpejgdakdlpc?",
      },
    ],
  },
  {
    label: "Contact us",
    children: [
      {
        label: "Email",
        subLabel: "Contact us about new features",
        href: "/email",
      },
      {
        label: "Other Projects",
        subLabel: "",
        href: "#",
      },
    ],
  },
  {
    label: "Donate",
    href: "/donate",
  },

  {
    label: "Login",
    href: "/login",
  },
];
