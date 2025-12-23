
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useEffect } from "react";

export default function SeatLayout({ seats, handleSeatClick, selectedSeats }) {

    useEffect(()=> {console.log("seat : ", seats)});

    const renderSeatGroup = (seatGroups, type) => {
        return Object.entries(seatGroups).map(([row, group]) => (
            <Box key={row} display="flex" gap={1} justifyContent="center" flexWrap="wrap" mb={2}>
                {console.log("Seat type inside render:", type)}
                <Box width={40} height={40} display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="subtitle1" fontWeight="bold">{row}</Typography>
                </Box>
                {group.map(seat => (
                    <div
                        onClick={() => !seat.booked && handleSeatClick(seat)}
                        className={`border p-2 fw-bold d-flex align-items-center justify-content-center rounded
                            ${seat.booked
                                ? ''
                                : selectedSeats.includes(seat)
                                    ? 'bg-success text-white'
                                    : type === 'STANDARD'
                                        ? ''
                                        : ''
                            }`}
                        style={{
                            width: '40px',
                            height: '40px',
                            cursor: seat.booked ? 'not-allowed' : 'pointer',
                            boxShadow: selectedSeats.includes(seat) ? '0 0 8px #28a745' : 'none',
                            backgroundColor: seat.booked
                                ? '#6c757d'
                                : selectedSeats.includes(seat)
                                    ? '#28a745'
                                    : type === 'STANDARD'
                                        ? '#fff59d'
                                        : '#90caf9',
                            color: seat.booked || selectedSeats.includes(seat) ? 'white' : 'black', // text color
                        }}
                    >
                        {seat.seatNumber.slice(2)}
                    </div>



                ))}
            </Box>
        ));
    };

    return (
        <div>
            {Object.keys(seats).length > 0 && (
                <Card sx={{ mb: 3, p: 2 }}>
                    <CardContent>
                        <Typography variant="h6" align="center" gutterBottom fontWeight="bold" color="black" sx={{ mb: 2 }}>
                            {Object.values(seats)[0]?.[0]?.seatType === "STANDARD" ? "Standard" : "Premium"} Seats - Price: ₹{Object.values(seats)[0]?.[0]?.price || 0}
                        </Typography>

                        {renderSeatGroup(seats, Object.values(seats)[0][0].seatType)}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};