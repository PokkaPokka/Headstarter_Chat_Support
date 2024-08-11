"use client";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Headstarter AI assistant. How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder
          .decode(value || new Int8Array(), { stream: true })
          .replace(/^"|"$/g, ""); // Replace only the starting and ending double quotes

        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });

        return reader.read().then(processText);
      });
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width="550px"
        height="900px"
        sx={{ boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)" }}
        border="1px solid #1C1E23"
        borderRadius={2}
        spacing={3}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          borderBottom="1px solid #1C1E23"
          sx={{
            bgcolor: "#1C1E23",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h5"
            style={{ fontWeight: "bold", textAlign: "center" }}
            padding={1.5}
            color="#FFFFFF"
          >
            Headstarter Chat Support
          </Typography>
        </Stack>

        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow={"auto"}
          maxHeight={"100%"}
          padding={2}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
              padding={0.5}
            >
              {message.role === "assistant" && (
                <Box display="flex" flexDirection={"row"} alignItems={"center"}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={50}
                    height={50}
                    borderRadius="50%"
                    overflow="hidden"
                    mr={1}
                    sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                  >
                    <img
                      src="/headstarter-logo.jpg"
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Box>
              )}
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                pl={3}
                pr={3}
                pt={1}
                pb={1}
                sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2} padding={2}>
          <TextField
            label="message"
            fullWidth
            sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
