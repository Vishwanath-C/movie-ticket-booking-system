package com.example.MovieTicketBooking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "movie")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Movie
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    @NotBlank
    @Size(max = 100)
    @ToString.Include
    private String title;

    @Column(nullable = false, length = 500)
    @NotBlank
    @Size(max = 500)
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private int duration;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<MovieSchedule> movieSchedules = new ArrayList<>();
}
