import { useEffect, useState } from "react";
import apiClient from "../api";
import TheatreCard from "./TheatreCard";

// MUI imports
import { Container, Typography, Grid, CircularProgress, Alert, Box, Button } from "@mui/material";

export default function ViewTheatres() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const getTheatres = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/theatres", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTheatres(response.data);

    } catch (err) {
      setError("Could not load theatres. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTheatres();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb:4, textAlign: "center" }}>
      {/* Header */}
      <Box
        sx={{
          display: "inline-block",
          bgcolor: "primary.main",
          color: "white",
          px: 3,
          py: 1,
          borderRadius: 2,
          boxShadow: 3,
          mb: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold" align="center">
          Theatres
        </Typography>
      </Box>

      {/* Loading */}
      {loading && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Grid>
      )}

      {/* Error with Retry */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={getTheatres}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Theatres Grid */}
      {!loading && !error && (
        <>
          {theatres.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No theatres available.
            </Alert>
          ) : (
            <Grid container justifyContent="center" spacing={3}>
              {theatres.map((theatre) => (
                <Grid item key={theatre.id} xs={12} sm={6} md={4}>
                  <TheatreCard theatre={theatre} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}
