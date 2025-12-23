import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import apiClient from "../api";

const AddTheatreAndSeats = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Theatre info
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  // Seat info
  const [seatTypes, setSeatTypes] = useState([]);
  const [seatConfigs, setSeatConfigs] = useState([]);
  const [currentSeatType, setCurrentSeatType] = useState("REGULAR");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentRows, setCurrentRows] = useState(0);
  const [currentSeatsPerRow, setCurrentSeatsPerRow] = useState(0);

  // Validation errors
  const [errors, setErrors] = useState({
    name: "",
    location: "",
    seatType: "",
    currentPrice: "",
    currentRows: "",
    currentSeatsPerRow: "",
  });

  // Success notification
  const [theatreAddedAlert, setTheatreAddedAlert] = useState({ show: false, msg: "" });

  // Fetch seat types
  useEffect(() => {
    const fetchSeatTypes = async () => {
      try {
        const response = await apiClient.get("/seats/types", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSeatTypes(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSeatTypes();
  }, [token]);

  // Add a seat configuration
  const addSeatConfig = (e) => {
    e.preventDefault();
    const newErrors = { seatType: "", currentPrice: "", currentRows: "", currentSeatsPerRow: "" };
    let valid = true;

    if (currentPrice < 0) {
      newErrors.currentPrice = "Price cannot be negative.";
      valid = false;
    }
    if (currentRows < 1) {
      newErrors.currentRows = "Rows must be at least 1.";
      valid = false;
    }
    if (currentSeatsPerRow < 1) {
      newErrors.currentSeatsPerRow = "Seats per row must be at least 1.";
      valid = false;
    }
    if (seatConfigs.some((c) => c.seatType === currentSeatType)) {
      newErrors.seatType = `${currentSeatType} is already added.`;
      valid = false;
    }

    if (!valid) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setSeatConfigs([
      ...seatConfigs,
      {
        seatType: currentSeatType,
        price: parseFloat(currentPrice),
        rowCount: parseInt(currentRows),
        seatsPerRow: parseInt(currentSeatsPerRow),
      },
    ]);

    // Reset seat inputs
    setCurrentSeatType("")
    setCurrentPrice("");
    setCurrentRows("");
    setCurrentSeatsPerRow("");
    setErrors((prev) => ({ ...prev, seatType: "", currentPrice: "", currentRows: "", currentSeatsPerRow: "" }));
  };

  // Submit the theatre
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { name: "", location: "" };
    let valid = true;

    if (!name.trim()) {
      newErrors.name = "Theatre name is required.";
      valid = false;
    }
    if (!location.trim()) {
      newErrors.location = "Theatre location is required.";
      valid = false;
    }
    if (seatConfigs.length === 0) {
      valid = false;
      newErrors.seatType = "Add at least one seat configuration.";
    }

    // if (!valid) {
    //   setErrors((prev) => ({ ...prev, ...newErrors }));
    //   return;
    // }

    const requestBody = { name, location, seatTypeRequests: seatConfigs };

    try {
      await apiClient.post("/theatres", requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTheatreAddedAlert({ show: true, msg: "Theatre successfully added." });
      setTimeout(() => setTheatreAddedAlert({ show: false, msg: "" }), 3000);

      // Reset form
      setName("");
      setLocation("");
      setSeatConfigs([]);
      setErrors({ name: "", location: "", seatType: "", currentPrice: "", currentRows: "", currentSeatsPerRow: "" });
    } catch (error) {
      console.error(error);
    }
  };

  if (role !== "ADMIN") {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        You are not authorized to add theatres.
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9fafb" }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ borderBottom: 2, borderColor: "primary.main", display: "inline-block", pb: 1 }}>
            Add a Theatre
          </Typography>
        </Box>


        <Box component="form" onSubmit={handleSubmit}>
          {/* Theatre Details */}
          <TextField
            label="Theatre Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name || " "}
          />
          <TextField
            label="Theatre Location"
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={!!errors.location}
            helperText={errors.location || " "}
          />

          {/* Seat Configurations */}
          <Box sx={{ my: 2, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="medium" sx={{ borderBottom: 1, borderColor: "grey.400", display: "inline-block", pb: 0.5 }}>
              Seat Configurations
            </Typography>
          </Box>

          <FormControl fullWidth margin="normal" error={!!errors.seatType}>
            <InputLabel>Seat Type</InputLabel>
            <Select value={currentSeatType} onChange={(e) => setCurrentSeatType(e.target.value)} label="Seat Type">
              {seatTypes.map((type, idx) => (
                <MenuItem key={idx} value={type}>{type}</MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="error">{errors.seatType || " "}</Typography>
          </FormControl>

          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 0.01, step: 0.01 }}
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            error={!!errors.currentPrice}
            helperText={errors.currentPrice || " "}
          />
          <TextField
            label="Number of Rows"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
            value={currentRows}
            onChange={(e) => setCurrentRows(e.target.value)}
            error={!!errors.currentRows}
            helperText={errors.currentRows || " "}
          />
          <TextField
            label="Seats Per Row"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
            value={currentSeatsPerRow}
            onChange={(e) => setCurrentSeatsPerRow(e.target.value)}
            error={!!errors.currentSeatsPerRow}
            helperText={errors.currentSeatsPerRow || " "}
          />

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={addSeatConfig}
              disabled={currentPrice < 0 || currentRows < 1 || currentSeatsPerRow < 1}
            >
              Add Seat Configuration
            </Button>
          </Box>

          {/* Seat Config Table */}
          {seatConfigs.length > 0 && (
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Seat Type</TableCell>
                    <TableCell>Price (₹)</TableCell>
                    <TableCell>Rows</TableCell>
                    <TableCell>Seats/Row</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seatConfigs.map((config, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{config.seatType}</TableCell>
                      <TableCell>{config.price}</TableCell>
                      <TableCell>{config.rowCount}</TableCell>
                      <TableCell>{config.seatsPerRow}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => setSeatConfigs(seatConfigs.filter((_, i) => i !== index))}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Submit */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" disabled={seatConfigs.length === 0}>
              Add Theatre
            </Button>
          </Box>
          {theatreAddedAlert.show && (
            <Alert
              severity="success"
              sx={{ mt: 2, mb: 2 }}
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => setTheatreAddedAlert({ show: false, msg: "" })}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {theatreAddedAlert.msg}
            </Alert>
          )}

        </Box>
      </Paper>
    </Container>
  );
};

export default AddTheatreAndSeats;
