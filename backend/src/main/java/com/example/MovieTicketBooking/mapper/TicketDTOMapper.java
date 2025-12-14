package com.example.MovieTicketBooking.mapper;

import com.example.MovieTicketBooking.dto.requestdtos.TicketRequestDto;
import com.example.MovieTicketBooking.dto.responsedtos.TicketResponseDto;
import com.example.MovieTicketBooking.exception.ResourceNotFoundException;
import com.example.MovieTicketBooking.model.MovieShow;
import com.example.MovieTicketBooking.model.Ticket;
import com.example.MovieTicketBooking.model.User;
import com.example.MovieTicketBooking.repository.UserRepository;
import com.example.MovieTicketBooking.service.MovieShowService;
import com.example.MovieTicketBooking.service.TicketSeatService;
import com.example.MovieTicketBooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TicketDTOMapper {

    @Autowired
    UserService userService;

    @Autowired
    ShowSeatRequestDtoMapper showSeatRequestDtoMapper;

    @Autowired
    MovieShowService movieShowService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TicketSeatService ticketSeatService;

    public Ticket mapToTicket(TicketRequestDto ticketRequestDto) {
        MovieShow movieShow = movieShowService.getMovieShowById(ticketRequestDto.getMovieShowId());

        User user = userRepository.findByEmail(ticketRequestDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setMovieShow(movieShow);
        ticket.setUser(user);
//        ticket.setTotalPrice(ticketRequestDto.getTotalPrice());

        return ticket;
    }

    public TicketResponseDto toResponseDto(Ticket ticket){
        TicketResponseDto ticketResponseDto = TicketResponseDto.builder()
                .ticketId(ticket.getId())
                .movieTitle(ticket.getMovieShow().getMovieSchedule().getMovie().getTitle())
                .theatreName(ticket.getMovieShow().getMovieSchedule().getTheatre().getName())
                .location(ticket.getMovieShow().getMovieSchedule().getTheatre().getLocation())
                .totalPrice(ticket.getTotalPrice())
                .showDate(ticket.getMovieShow().getShowDate())
                .showTime(ticket.getMovieShow().getShowTime())
                .seatNumbers(ticket.getTicketSeats().stream().map(ticketSeat -> ticketSeat.getShowSeat().getSeat().getSeatNumber())
                        .collect(Collectors.toList()))
                .build();
        return ticketResponseDto;
    }
    
}
