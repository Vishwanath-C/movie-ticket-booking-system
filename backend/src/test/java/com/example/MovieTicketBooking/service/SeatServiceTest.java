package com.example.MovieTicketBooking.service;


import com.example.MovieTicketBooking.model.Seat;
import com.example.MovieTicketBooking.model.Theatre;
import com.example.MovieTicketBooking.model.enums.SeatType;
import com.example.MovieTicketBooking.repository.SeatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class SeatServiceTest
{
    @Mock
    private SeatRepository seatRepository;

    @Mock
    private TheatreService theatreService;

    @InjectMocks
    private SeatService seatService;

    private Seat seat;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
        seat = Seat.builder().id(1L).seatType(SeatType.STANDARD).price(new BigDecimal(200L)).build();
    }

    @Test
    void testCreateSeat(){
        when(seatRepository.save(seat)).thenReturn(seat);

        Seat result = seatService.createSeat(seat);

        assertNotNull(result);
        assertEquals(seat, result);
    }

    @Test
    void testGetSeatById(){
        when(seatRepository.findById(1L)).thenReturn(Optional.of(seat));

        Seat result = seatService.getSeatById(1L);

        assertNotNull(result);
        assertEquals(seat, result);
    }

    @Test
    void testGetAllSeatsByTheatreId(){

        List<Seat> seats = new ArrayList<>();
        seats.add(Seat.builder().id(1L).seatNumber("GA1").seatType(SeatType.STANDARD).price(new BigDecimal(200L)).build());
        seats.add(Seat.builder().id(2L).seatNumber("GA3").seatType(SeatType.STANDARD).price(new BigDecimal(200L)).build());

        Theatre theatre = Theatre.builder().id(1L).name("Aruna").location("Davanagere").build();

        when(theatreService.getTheatreEntityById(1L)).thenReturn(theatre);
        when(seatRepository.findAllByTheatre(theatre)).thenReturn(seats);

        List<Seat> result = seatService.getAllSeatsByTheatreId(1L);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(seats, result);
        verify(theatreService, times(1)).getTheatreEntityById(1L);
        verify(seatRepository, times(1)).findAllByTheatre(theatre);
    }
}
