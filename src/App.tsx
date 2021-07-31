import * as React from "react";
import { ChangeEvent, useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Grid,
  Textarea,
  theme,
  Heading,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import CopyToClipboard from "react-copy-to-clipboard";
import gfm from "remark-gfm";

const style = {
  border: "1px solid black",
  borderRadius: "0.5rem",
  margin: "1rem",
  background: "white",
};

export const App = () => {
  const [output, setOutput] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e?.target?.value;
    console.log(val);
    const arr = val.split(/\r?\n/);
    const outString = arr
      .map((line) => {
        if (/\d*:\d\d/.test(line)) {
          const index = line.match(/\d/)?.index;
          const modLine = line.slice(0, index) + " " + line.slice(index);
          return `# ${modLine}`;
        }
        return line;
      })
      .join("\n\n");
    setOutput(outString);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="left" fontSize="xl" background={"lightcoral"}>
        <Grid minH="100vh" padding={"5rem"} templateColumns={"1fr 1fr"}>
          <Box style={style}>
            <Textarea
              variant={"unstyled"}
              onChange={handleChange}
              height={"100%"}
              resize={"none"}
              padding={"1rem"}
            />
          </Box>
          <Box style={{ ...style, padding: "0 2rem", position: "relative" }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <Heading marginTop={"1rem"} size={"md"}>
                    {children}
                  </Heading>
                ),
              }}
              remarkPlugins={[gfm]}
            >
              {output}
            </ReactMarkdown>
            <CopyToClipboard text={output}>
              <Button
                margin={"0.5rem"}
                position={"absolute"}
                bottom={"0"}
                right={"0"}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Box>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
