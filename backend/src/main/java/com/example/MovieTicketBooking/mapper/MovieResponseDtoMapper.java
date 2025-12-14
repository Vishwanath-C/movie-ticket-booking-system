package com.example.MovieTicketBooking.mapper;

import org.springframework.stereotype.Component;

import com.example.MovieTicketBooking.dto.responsedtos.MovieResponseDto;
import com.example.MovieTicketBooking.model.Movie;

import java.time.LocalDate;

@Component
public class MovieResponseDtoMapper {
    public MovieResponseDto movieToDto(Movie movie) {
        System.out.println(movie);
        MovieResponseDto movieResponseDto = MovieResponseDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .imageUrl(movie.getImageUrl())
                .durationMinutes(movie.getDuration())
                .isUpcoming(movie.getMovieSchedules().stream().
                        anyMatch(ma -> !LocalDate.now().isAfter(ma.getStartDate())))
                .build();

        return movieResponseDto;
    }
}
