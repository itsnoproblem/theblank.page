// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from "@chakra-ui/react"
// 2. Add your color mode config
const config : ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: true,
}
// 3. extend the theme
const theme = extendTheme({ config })
theme.config.initialColorMode = "light";
theme.config.useSystemColorMode = true;
export default theme