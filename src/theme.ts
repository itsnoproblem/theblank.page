import {extendTheme} from "@chakra-ui/react"

const theme = extendTheme({
    fonts: {
        DrawerFooter: "Montserrat",
    },
    config: {
        initialColorMode: "light",
        useSystemColorMode: true,
    },

})

theme.config.initialColorMode = "light";
theme.config.useSystemColorMode = true;
export default theme