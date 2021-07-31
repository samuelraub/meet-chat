import * as React from "react";
import { ChangeEvent, useRef, useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Divider,
  Heading,
  Input,
  SimpleGrid,
  Textarea,
  theme,
} from "@chakra-ui/react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import CopyToClipboard from "react-copy-to-clipboard";

const doSomethingToNameLines = (str: string, cb: (str: string) => string) => {
  const arr = str.split(/\r?\n/);
  return arr.map((line) => {
    if (/\d*:\d\d/.test(line)) {
      return cb(line);
    }
    return line;
  });
};

export const App = () => {
  const [output, setOutput] = useState("");

  const [searchReplace, setSearchReplace] = useState(["", ""]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e?.target?.value;
    const outString = doSomethingToNameLines(val, (line) => {
      const index = line.match(/\d/)?.index;
      const modLine = line.slice(0, index) + " " + line.slice(index);
      return `# ${modLine}`;
    }).join("\n\n");
    setOutput(outString);
  };

  const handleClick = () => {
    const range = document.createRange();
    range.selectNode(resultBox.current);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
    window.getSelection()?.removeAllRanges();
  };

  const resultBox = useRef<any>(null);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="left" fontSize="xl">
        <Heading textAlign={"center"}>🤝 Meet Chat Formatter</Heading>
        <SimpleGrid
          padding={["1rem", null, "5rem"]}
          columns={[1, null, 2]}
          spacing={"1rem"}
        >
          <Box minHeight={"5rem"}>
            <Textarea
              placeholder={"Paste Google Meet Chat"}
              variant={"filled"}
              onChange={handleChange}
              height={"100%"}
              resize={"none"}
              padding={"1rem"}
            />
          </Box>
          <Box
            padding={"1rem 2rem"}
            border={"1px solid black"}
            borderRadius={"6px"}
            minHeight={"5rem"}
          >
            <div ref={resultBox}>
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
            </div>
          </Box>
          <Box></Box>
          <Box>
            <Button
              leftIcon={<CopyIcon />}
              onClick={handleClick}
              marginRight={"1rem"}
              marginBottom={"1rem"}
            >
              Copy formatted
            </Button>
            <CopyToClipboard text={output}>
              <Button leftIcon={<CopyIcon />} marginBottom={"1rem"}>
                Copy markdown
              </Button>
            </CopyToClipboard>
          </Box>
        </SimpleGrid>
        <Divider />
        <SimpleGrid
          padding={["1rem", null, "5rem"]}
          columns={[1, null, 2]}
          spacing={"1rem"}
        >
          <Box>
            <Input
              variant={"filled"}
              placeholder={"Search Name"}
              onChange={(e) =>
                setSearchReplace((prev) => [e.target.value, prev[1]])
              }
            />
          </Box>
          <Box>
            <Input
              variant={"filled"}
              placeholder={"Replace With"}
              onChange={(e) =>
                setSearchReplace((prev) => [prev[0], e.target.value])
              }
            />
            <Button
              marginTop={"1rem"}
              leftIcon={<CheckIcon />}
              onClick={() => {
                const outString = doSomethingToNameLines(output, (line) => {
                  return line.replace(searchReplace[0], searchReplace[1]);
                }).join("\n");
                setOutput(outString);
              }}
            >
              Confirm
            </Button>
          </Box>
        </SimpleGrid>
      </Box>
    </ChakraProvider>
  );
};
