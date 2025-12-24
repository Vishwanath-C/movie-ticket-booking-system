import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleRegisterClick = () => navigate("/register");
  const handleLoginClick = () => navigate("/login");

  useEffect(() => {
    if(isLoggedIn){
    navigate("home")};
  }, [isLoggedIn, navigate]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center"
      }}
    >

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🎬 Welcome to Movie Ticket Booking
      </Typography>
     
      {!isLoggedIn && (
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleRegisterClick}
            aria-label="Register for a new account"
          >
            Register
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleLoginClick}
          >
            Login
          </Button>
        </Box>
      )}


    </Container>
  );
};

export default HomePage;
