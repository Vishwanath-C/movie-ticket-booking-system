package com.example.MovieTicketBooking.dto.responsedtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketResponseDto
{
    private Long ticketId;
    private String movieTitle;
    private String theatreName;
    private String location;
    private LocalDate showDate;
    private LocalTime showTime;
    private List<String> seatNumbers;
    private BigDecimal totalPrice;
}
