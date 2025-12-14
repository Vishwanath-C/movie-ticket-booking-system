import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import apiClient from "../api";

function CustomAlert({ severity, msg, onClose }) {
  return (
    <Alert
      severity={severity}
      sx={{ mb: 2 }}
      action={
        <IconButton size="small" color="inherit" onClick={onClose}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {msg}
    </Alert>
  );
}

export default function AddMovieForm() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [movieTitle, setMovieTitle] = useState("");
  const [movieDescription, setMovieDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [successAlert, setSuccessAlert] = useState({ show: false, msg: "" });
  const [duplicateAlert, setDuplicateAlert] = useState({ show: false, msg: "" });
  const [errors, setErrors] = useState({ movieTitle: "", movieDescription: "", durationMinutes: "" });
  const [loading, setLoading] = useState(false);

  if (role !== "ADMIN") {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        You are not authorized to add movies.
      </Alert>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { movieTitle: "", movieDescription: "", durationMinutes: "" };

    if (!movieTitle.trim()) {
      newErrors.movieTitle = "Title is required.";
      valid = false;
    }

    if (!movieDescription.trim()) {
      newErrors.movieDescription = "Description is required.";
      valid = false;
    }

    const duration = parseInt(durationMinutes, 10);
    if (!duration || duration <= 0) {
      newErrors.durationMinutes = "Duration must be greater than 0.";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);
    try {
      await apiClient.post(
        "/movies",
        { title: movieTitle, description: movieDescription, duration, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessAlert({ show: true, msg: "Movie added successfully!" });
      setTimeout(() => setSuccessAlert({ show: false, msg: "" }), 3000);

      setMovieTitle("");
      setMovieDescription("");
      setDurationMinutes("");
      setErrors({ movieTitle: "", movieDescription: "", durationMinutes: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setDuplicateAlert({
        show: true,
        msg: `Movie with name "${movieTitle}" already exists.`,
      });
      setTimeout(() => setDuplicateAlert({ show: false, msg: "" }), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb:4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9fafb" }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              display: "inline-block",
              borderBottom: 2,
              borderColor: "primary.main",
              pb: 1,
            }}
          >
            Add Movie
          </Typography>
        </Box>

        {successAlert.show && (
          <CustomAlert
            severity="success"
            msg={successAlert.msg}
            onClose={() => setSuccessAlert({ show: false, msg: "" })}
          />
        )}

        {duplicateAlert.show && (
          <CustomAlert
            severity="warning"
            msg={duplicateAlert.msg}
            onClose={() => setDuplicateAlert({ show: false, msg: "" })}
          />
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            error={!!errors.movieTitle}
            helperText={errors.movieTitle || " "}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            maxRows={6}
            value={movieDescription}
            onChange={(e) => setMovieDescription(e.target.value)}
            error={!!errors.movieDescription}
            helperText={errors.movieDescription || " "}
          />

           <TextField
            label="Image Url"
            fullWidth
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl || " "}
          />

          <TextField
            label="Duration (minutes)"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            error={!!errors.durationMinutes}
            helperText={errors.durationMinutes || " "}
          />

          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                borderRadius: 2,
                px: 4,
                fontWeight: "bold",
                transition: "0.3s",
                '&:hover': { transform: "scale(1.03)" },
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Movie"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
