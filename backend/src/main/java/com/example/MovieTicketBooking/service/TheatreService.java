package com.example.MovieTicketBooking.service;

import com.example.MovieTicketBooking.dto.SeatDto;
import com.example.MovieTicketBooking.dto.requestdtos.SeatTypeRequest;
import com.example.MovieTicketBooking.dto.requestdtos.TheatreRequestDto;
import com.example.MovieTicketBooking.dto.responsedtos.TheatreResponseDto;
import com.example.MovieTicketBooking.exception.ResourceNotFoundException;
import com.example.MovieTicketBooking.mapper.TheatreRequestDtoMapper;
import com.example.MovieTicketBooking.mapper.TheatreResponseDtoMapper;
import com.example.MovieTicketBooking.model.Seat;
import com.example.MovieTicketBooking.model.Theatre;
import com.example.MovieTicketBooking.model.enums.SeatType;
import com.example.MovieTicketBooking.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheatreService
{
    private final TheatreRepository theatreRepository;
    private final TheatreRequestDtoMapper theatreRequestDtoMapper;
    private final TheatreResponseDtoMapper theatreResponseDtoMapper;

    /**
     * Creates a new theatre and initializes seats based on the provided request data
     *
     * @param theatreRequestDto the theatre request data
     * @return response dto containing theatre details
     */
    @Transactional
    public TheatreResponseDto createTheatre(TheatreRequestDto theatreRequestDto) {
        Theatre theatre = Theatre.builder()
                .name(theatreRequestDto.name())
                .location(theatreRequestDto.location())
                .build();

        List<Seat> seats = new ArrayList<>();

        for (SeatTypeRequest seatTypeRequest : theatreRequestDto.seatTypeRequests()) {
            for (char row = 'A'; row < 'A' + seatTypeRequest.getRowCount(); row++) {
                for (int i = 1; i <= seatTypeRequest.getSeatsPerRow(); i++) {

                    String seatNumber = seatTypeRequest.getSeatType() == SeatType.STANDARD ? ("S" + row + i)
                            : ("P" + row + i);

                    Seat seat = Seat.builder()
                            .seatType(seatTypeRequest.getSeatType())
                            .seatNumber(seatNumber)
                            .theatre(theatre)
                            .price(seatTypeRequest.getPrice())
                            .build();

                    seats.add(seat);
                }
            }
        }

        theatre.setSeats(seats);

        Theatre savedTheatre = theatreRepository.save(theatre);

        List<SeatDto> seatRequestDtos = mapSeatsToDto(savedTheatre.getSeats());

        return new TheatreResponseDto(
                savedTheatre.getId(),
                savedTheatre.getName(),
                savedTheatre.getLocation(),
                seatRequestDtos
        );
    }

    /**
     * Retrieves all theatres and their seat details
     *
     * @return a list of theatre response DTOs
     */
    public List<TheatreResponseDto> getAllTheatres() {
        List<Theatre> theatres = theatreRepository.findAll();
        List<TheatreResponseDto> responseDtos = new ArrayList<>();

        for (Theatre theatre : theatres) {
            TheatreResponseDto dto = TheatreResponseDto
                    .builder()
                    .id(theatre.getId())
                    .name(theatre.getName())
                    .location(theatre.getLocation())
                    .build();

            responseDtos.add(dto);
        }
        return responseDtos;
    }

    /**
     * Retrieves Theatre entity using ID
     *
     * @param id the theatre ID
     * @return Theatre entity
     */
    public Theatre getTheatreEntityById(Long id) {
        return theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre with id " + id + " not found!"));
    }

    /**
     * Retrieves theatre details by its id
     *
     * @param id the theatre id
     * @return theatre response DTO
     */
    public TheatreResponseDto getTheatreById(Long id) {
        Theatre theatre = theatreRepository.findById(id).
                orElseThrow(() -> new ResourceNotFoundException("Theatre with id " + id + "not found!"));

        List<SeatDto> seatRequestDtos = mapSeatsToDto(theatre.getSeats());

        return new TheatreResponseDto(theatre.getId(), theatre.getName(), theatre.getLocation(), seatRequestDtos);
    }

    public TheatreResponseDto getTheatreDtoById(Long id) {
        Theatre theatre = theatreRepository.findById(id).
                orElseThrow(() -> new ResourceNotFoundException("Theatre with id " + id + "not found!"));

        List<SeatDto> seatRequestDtos = mapSeatsToDto(theatre.getSeats());

        return new TheatreResponseDto(theatre.getId(), theatre.getName(), theatre.getLocation(), seatRequestDtos);
    }

    public Theatre getTheatreByName(String name) {
        return theatreRepository.findOneByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with name '" + name + "' not found!"));
    }

    public void deleteTheatre(Long id) {
        theatreRepository.delete(getTheatreEntityById(id));
    }

    private List<SeatDto> mapSeatsToDto(List<Seat> seats) {
        return seats.stream()
                .map(seat -> new SeatDto(seat.getSeatNumber(),
                        seat.getSeatType(), seat.getPrice()))
                .collect(Collectors.toList());
    }


}
