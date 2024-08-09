import axios from "axios";
import React, { useState, useEffect } from "react";
import "@fontsource/roboto/400.css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

function Profile() {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [userId, setUserId] = useState("");
  const [authHeader, setAuthHeader] = useState("");

  useEffect(() => {
    // Retrieve user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    console.log('User data:', userData); // Add this line for debugging
    if (userData) {
      setname(userData.name || "");
      setEmail(userData.email || "");
      setUserId(userData.id || ""); // Assuming userData contains an 'id' field
      
      // Basic Auth Header: 'username:password'
      const credentials = `${userData.username}:${userData.password}`; // Adjust based on where you store credentials
      const encodedCredentials = btoa(credentials);
      setAuthHeader(`Basic ${encodedCredentials}`);

    }
  }, []);

  const handlenameChange = (event) => {
    setname(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
        .post(`http://localhost:8000/api/profile/${userId}`, {
        name: name,
        email: email,
      }, {
        headers: {
          Authorization: authHeader,
        }
      })
      .then((response) => {
        console.log(response);
        setApiResponse(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setApiResponse(error.response.data.message);
      });
  };

  return (
    <div>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5%",
      }}
    >
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Typography
            style={{ marginBottom: "20px" }}
            variant="h2"
            component="h2"
          >
            Update Profile
          </Typography>
          {apiResponse && (
            <Alert
              style={{ marginBottom: "20px" }}
              severity={apiResponse.includes("success") ? "success" : "error"}
            >
              {apiResponse}
            </Alert>
          )}
          <TextField
            type="text"
            value={name}
            onChange={handlenameChange}
            variant="filled"
            id="filled-basic"
            label="Fullname"
            fullWidth
            style={{ marginBottom: "20px" }}
          />
          <TextField
            type="email"
            value={email}
            onChange={handleEmailChange}
            variant="filled"
            id="filled-basic"
            label="Email address"
            fullWidth
            style={{ marginBottom: "20px" }}
          />
          <Button variant="contained" type="submit">
            Update
          </Button>
        </form>
      </Container>
    </Box>
    </div>
  );
}

export default Profile;
