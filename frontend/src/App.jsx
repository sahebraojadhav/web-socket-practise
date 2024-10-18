import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { Typography, Container } from "@mui/material";
import { TextField, Button, Box, Stack } from "@mui/material";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName,setRoomName]=useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message-send", { message, room });
    setMessage("");
    setRoom("");
  };

  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("message-send", (data) => {
      console.log("messaged-send here", data);
      setMessages((messages) => [...messages, data]);
    });
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h1" component="div" gutterBottom>
          Welcome to socket.io
        </Typography>

        <Box sx={{ height: 200 }} />

        <Typography variant="h4" component="div" gutterBottom>
          {socketID}
        </Typography>

        <form onSubmit={joinRoomHandler}>
          <h5>Join Room</h5>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            id="outlined-basic"
            label="Room name"
            variant="outlined"
          />

          <Button type="submit" variant="contained" color="primary">
           Join
          </Button>
        </form>

        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basic"
            label="Message"
            variant="outlined"
          />

          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            id="outlined-basic"
            label="Room"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>

        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
}

export default App;
