import * as React from "react"
import {Box, ChakraProvider, Grid, Textarea, theme,} from "@chakra-ui/react"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl" background={'lightcoral'}>
      <Grid minH="100vh" p={3}>
        <Textarea>

        </Textarea>
      </Grid>
    </Box>
  </ChakraProvider>
)
