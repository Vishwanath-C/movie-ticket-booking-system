import { Box, Button, Card, CardActions, CardMedia, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import NoImageAvailable from "../assets/no-image-available.png";

const MovieCard = ({ movie }) => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/app/bookings/${movie.id}`, { state: { movie } });
  };

  return (
    <Card
      sx={{
        width: 220,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 6,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 10,
        },
      }}
    >
      {/* Top Box - Poster */}
      <Box sx={{ height: 220, overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={movie.imageUrl || NoImageAvailable}
          alt={movie.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",   // shows full image without cropping
            backgroundColor: "#000" // fills empty space if aspect ratio differs
          }}
        />
      </Box>

      {/* Bottom Box - Info + Actions */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Movie Title */}
        <Typography
          variant="h6"
          align="center"
          // sx={{
          //   fontWeight: "bold",
          //   color: "primary.main",
          //   textTransform: "uppercase",
          //   mb: 1,
          // }}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}

        >
          {movie.title}
        </Typography>

        {/* Book/View Button */}
        <CardActions sx={{ justifyContent: "center", mt: 1 }}>
          {(role === "ADMIN" || role === "USER") && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleBooking}
              sx={{
                fontWeight: "bold",
                px: 4,
                borderRadius: 2,
                textTransform: "capitalize",
              }}
            >
              {role === "ADMIN" ? "View Shows" : "Book"}
            </Button>
          )}
        </CardActions>
      </Box>
    </Card>
  );
};

export default MovieCard;
