import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../api";
import { getCurrentUser } from "../utils/auth";
import SeatLayout from "./SeatLayout";
import { Box, Typography, Chip, Card, CardContent, Snackbar, Alert, Button } from "@mui/material";
import screen from '../assets/screen.png';

const ShowSeatLayoutModern = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatAlert, setSelectedSeatAlert] = useState({ show: false, msg: "", severity: "warning" });
  const [totalPrice, setTotalPrice] = useState(0);

  const [standardSeats, setStandardSeats] = useState({});
  const [premiumSeats, setPremiumSeats] = useState({});

  const navigate = useNavigate();
  const { state } = useLocation();
  const movieShow = state?.selectedShow;

  useEffect(() => {
    setUser(getCurrentUser());
    if (movieShow?.showSeats) setSeats(movieShow.showSeats);
    console.log('After ; ');
  }, [movieShow]);

  useEffect(() => {
    console.log("Updated Standard Seats:", movieShow);
    console.log("Updated Premium Seats:", premiumSeats);
  }, [standardSeats, premiumSeats]);


  useEffect(() => {
    console.log("Seats data:", seats);
    const standard = {};
    const premium = {};
    seats.forEach(seat => {
      const row = seat.seatNumber.charAt(1);
      if (seat.seatNumber.charAt(0) === 'S') standard[row] ? standard[row].push(seat) : standard[row] = [seat];
      if (seat.seatNumber.charAt(0) === 'P') premium[row] ? premium[row].push(seat) : premium[row] = [seat];
    });
    setStandardSeats(standard);
    setPremiumSeats(premium);
    console.log("Standard n :", standardSeats);
  }, [seats]);

  const handleSeatClick = (seat) => {
    setSelectedSeats(prev => {
      const isSelected = prev.includes(seat);
      if (isSelected) {
        setTotalPrice(prevPrice => prevPrice - seat.price);
        return prev.filter(s => s !== seat);
      }
      if (prev.length >= 5) {
        setSelectedSeatAlert({ show: true, msg: "Maximum 5 seats can be selected", severity: "warning" });
        return prev;
      }
      setTotalPrice(prevPrice => prevPrice + seat.price);
      return [...prev, seat];
    });
  };

  const handleBookSeats = async () => {
    const selectedSeatIds = selectedSeats.map(seat => seat.id);
    try {
      const response = await apiClient.post('/tickets',
        { showSeatIds: selectedSeatIds, movieShowId: movieShow.id, totalPrice, email: user.sub },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedSeatAlert({ show: true, msg: "Ticket booked successfully!", severity: "success" });
      setTimeout(() => setSelectedSeatAlert(a => ({ ...a, show: false })), 3000);
      // navigate('/app/seatlayout', { state: { selectedMovieShow: movieShow } });
      console.log("Ticket : ", response.data);
      navigate("/app/tickets/view", { state: { ticket: response.data } });
    } catch (error) {
      console.error("Error booking seats:", error);
    }
  };

  return (
    <Box p={2}>
      {/* Legend */}
      <Box display="flex" justifyContent="center" gap={2} mb={4}>
        <Chip label="Standard" sx={{ bgcolor: "#fff59d", color: "black", fontWeight: 'bold' }} />
        <Chip label="Premium" sx={{ bgcolor: "#90caf9", color: "black", fontWeight: 'bold' }} />
        <Chip label="Selected" sx={{ bgcolor: "success.main", color: "white", fontWeight: 'bold' }} />
        <Chip label="Booked" sx={{ bgcolor: "#6c757d", color: "white", fontWeight: 'bold' }} />
      </Box>

      <Typography variant="h4" align="center" gutterBottom>Seat Layout</Typography>
      {/* {standardSeats} */}

      {/* Standard Seats */}
      <SeatLayout
        seats={standardSeats}
        handleSeatClick={handleSeatClick}
        selectedSeats={selectedSeats}
        showPrice={true} // pass prop to display price
      />

      {/* Premium Seats */}
      <SeatLayout
        seats={premiumSeats}
        handleSeatClick={handleSeatClick}
        selectedSeats={selectedSeats}
        showPrice={true} // pass prop to display price
      />

      {/* Screen */}
      <Box textAlign="center" mb={3}>
        <img src={screen} alt="Screen" style={{ transform: "rotate(180deg)", maxWidth: "80%" }} />
      </Box>

      {/* Selected Seats */}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Selected Seats</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {selectedSeats.length > 0
              ? selectedSeats.map(seat => (
                <Chip key={seat.seatNumber} label={`${seat.seatNumber} (₹${seat.price})`} color="primary" sx={{ minWidth: 50 }} />
              ))
              : <Typography color="text.secondary">No seats selected</Typography>}
          </Box>
          <Typography variant="h6">Total Price: ₹{totalPrice}</Typography>
        </CardContent>
      </Card>

      {selectedSeats.length > 0 && (
        <Box textAlign="center" mb={3}>
          <Button variant="contained" color="primary" size="large" onClick={handleBookSeats}>
            Book Ticket
          </Button>
        </Box>
      )}

      <Snackbar open={selectedSeatAlert.show} autoHideDuration={3000} onClose={() => setSelectedSeatAlert(a => ({ ...a, show: false }))}>
        <Alert severity={selectedSeatAlert.severity} sx={{ width: '100%' }}>
          {selectedSeatAlert.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShowSeatLayoutModern;
