import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

const Ticket = ({ ticket }) => {
  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: 250,
        height: 300,
        borderRadius: 4,
        boxShadow: 4,
        mb: 3,
        backgroundColor: "#fafafa",
        transition: "transform 0.2s, box-shadow 0.2s",
        // "&:hover": {
        //   transform: "scale(1.03)",
        //   boxShadow: 6,
        // },
        mx: "auto",
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Movie Title */}
        <Box
          sx={{
            textAlign: "center",
            p: 1,
            borderRadius: 2,
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {ticket.movieTitle}
          </Typography>
        </Box>

        {/* Ticket Details */}
        <Box component="table" sx={{ width: "100%", tableLayout: "fixed" }}>
          <tbody>
            <tr>
              <td>
                <Typography fontWeight="bold">Theatre</Typography>
              </td>
              <td>
                <Typography>{ticket.theatreName}</Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography fontWeight="bold">Location</Typography>
              </td>
              <td>
                <Typography>{ticket.location}</Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography fontWeight="bold">Date</Typography>
              </td>
              <td>
                <Typography>{ticket.showDate}</Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography fontWeight="bold">Time</Typography>
              </td>
              <td>
                <Typography>{convertTo12Hour(ticket.showTime)}</Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography fontWeight="bold">Total Price</Typography>
              </td>
              <td>
                <Typography color="success.main">₹{ticket.totalPrice}</Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography fontWeight="bold">Seats</Typography>
              </td>
              <td>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)", // two seats per row
                    gap: 1,
                  }}
                >
                  {(ticket.seatNumbers || []).map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      color="secondary"
                      sx={{ width: "100%", justifyContent: "center" }}
                    />
                  ))}
                </Box>
              </td>
            </tr>
          </tbody>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Ticket;
