package com.example.MovieTicketBooking.dto.responsedtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MovieResponseDto {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private int durationMinutes;
    private boolean isCurrentlyRunning;
    private boolean isUpcoming;
    private List<LocalDate> availableShowDates;
}
