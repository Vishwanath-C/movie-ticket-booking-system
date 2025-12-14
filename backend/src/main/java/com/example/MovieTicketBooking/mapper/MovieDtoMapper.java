package com.example.MovieTicketBooking.mapper;

import org.springframework.stereotype.Component;

import com.example.MovieTicketBooking.dto.requestdtos.MovieRequestDto;
import com.example.MovieTicketBooking.model.Movie;

@Component
public class MovieDtoMapper {
    
    public Movie dtoToMovie(MovieRequestDto movieRequestDto){
        Movie movie = new Movie();
        movie.setTitle(movieRequestDto.getTitle());
        movie.setDescription(movieRequestDto.getDescription());
        movie.setImageUrl(movieRequestDto.getImageUrl());
        movie.setDuration(movieRequestDto.getDuration());
        return movie;
    }
}
