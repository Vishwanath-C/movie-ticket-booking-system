package com.example.MovieTicketBooking.service;

import com.example.MovieTicketBooking.dto.requestdtos.SeatTypeRequest;
import com.example.MovieTicketBooking.dto.requestdtos.TheatreRequestDto;
import com.example.MovieTicketBooking.dto.responsedtos.TheatreResponseDto;
import com.example.MovieTicketBooking.exception.ResourceNotFoundException;
import com.example.MovieTicketBooking.model.Seat;
import com.example.MovieTicketBooking.model.Theatre;
import com.example.MovieTicketBooking.model.enums.SeatType;
import com.example.MovieTicketBooking.repository.TheatreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TheatreServiceTest {

    @InjectMocks
    private TheatreService theatreService;

    @Mock
    private TheatreRepository theatreRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ===============================
    // Test: createTheatre
    // ===============================
    @Test
    void testCreateTheatre() {
        // Prepare input DTO
        SeatTypeRequest seatTypeRequest = new SeatTypeRequest(SeatType.PREMIUM, BigDecimal.valueOf(150), 2, 50);
        TheatreRequestDto requestDto = new TheatreRequestDto("PVR", "City Center", List.of(seatTypeRequest));

        // Mock repository save
        Theatre savedTheatre = Theatre.builder()
                .id(1L)
                .name("PVR")
                .location("City Center")
                .seats(new ArrayList<>())
                .build();

        when(theatreRepository.save(any(Theatre.class))).thenReturn(savedTheatre);

        // Call service
        TheatreResponseDto responseDto = theatreService.createTheatre(requestDto);

        // Verify
        assertNotNull(responseDto);
        assertEquals("PVR", responseDto.name());
        assertEquals("City Center", responseDto.location());
        verify(theatreRepository, times(1)).save(any(Theatre.class));
    }

    // ===============================
    // Test: getAllTheatres
    // ===============================
    @Test
    void testGetAllTheatres() {
        Theatre theatre1 = Theatre.builder().id(1L).name("PVR").location("City Center").build();
        Theatre theatre2 = Theatre.builder().id(2L).name("INOX").location("Downtown").build();

        when(theatreRepository.findAll()).thenReturn(List.of(theatre1, theatre2));

        List<TheatreResponseDto> result = theatreService.getAllTheatres();

        assertEquals(2, result.size());
        assertEquals("PVR", result.get(0).name());
        assertEquals("INOX", result.get(1).name());
        verify(theatreRepository, times(1)).findAll();
    }

    // ===============================
    // Test: getTheatreEntityById
    // ===============================
    @Test
    void testGetTheatreEntityById_Found() {
        Theatre theatre = Theatre.builder().id(1L).name("PVR").build();
        when(theatreRepository.findById(1L)).thenReturn(Optional.of(theatre));

        Theatre result = theatreService.getTheatreEntityById(1L);

        assertNotNull(result);
        assertEquals("PVR", result.getName());
    }

    @Test
    void testGetTheatreEntityById_NotFound() {
        when(theatreRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> theatreService.getTheatreEntityById(1L));
    }

    // ===============================
    // Test: getTheatreByName
    // ===============================
    @Test
    void testGetTheatreByName_Found() {
        Theatre theatre = Theatre.builder().id(1L).name("PVR").build();
        when(theatreRepository.findOneByName("PVR")).thenReturn(Optional.of(theatre));

        Theatre result = theatreService.getTheatreByName("PVR");

        assertEquals("PVR", result.getName());
    }

    @Test
    void testGetTheatreByName_NotFound() {
        when(theatreRepository.findOneByName("PVR")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> theatreService.getTheatreByName("PVR"));
    }

    // ===============================
    // Test: deleteTheatre
    // ===============================
    @Test
    void testDeleteTheatre() {
        Theatre theatre = Theatre.builder().id(1L).name("PVR").build();
        when(theatreRepository.findById(1L)).thenReturn(Optional.of(theatre));

        theatreService.deleteTheatre(1L);

        verify(theatreRepository, times(1)).delete(theatre);
    }

    // ===============================
    // Test: getTheatreById
    // ===============================
    @Test
    void testGetTheatreById_Found() {
        Seat seat = Seat.builder().seatNumber("G1A1").seatType(SeatType.STANDARD).price(BigDecimal.valueOf(500)).build();
        Theatre theatre = Theatre.builder().id(1L).name("PVR").location("City Center").seats(List.of(seat)).build();
        when(theatreRepository.findById(1L)).thenReturn(Optional.of(theatre));

        var response = theatreService.getTheatreById(1L);

        assertEquals(1L, response.id());
        assertEquals(1, response.seats().size());
        assertEquals("G1A1", response.seats().get(0).getSeatNumber());
    }
}
