package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Models.Review;
import com.PgPeekIn.Backend.Models.TenantReviewDTO;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Repository.PgRepo;
import com.PgPeekIn.Backend.Repository.TenantReviewRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tenant/reviews")
public class TenantReviewController {

    private final TenantReviewRepository tenantReviewRepository;
    private final AuthRepository authRepository;
    private final PgRepo pgRepo;

    @GetMapping("/my")
    public ResponseEntity<List<TenantReviewDTO>> getMyReviews(
            Authentication authentication) {

        // Get logged-in user's email from JWT
        String email = authentication.getName();

        // Find actual user
        User user = authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        // Fetch only this user's reviews
        List<Review> reviews =
                tenantReviewRepository.findByUserIdOrderByReviewDateDesc(userId);

        // Convert reviews to DTO
        List<TenantReviewDTO> response = reviews.stream()
                .map(review -> {

                    PgModel pg = pgRepo.findById(review.getPgId())
                            .orElse(null);

                    return TenantReviewDTO.builder()
                            .reviewId(review.getReviewId())
                            .bookingId(review.getBookingId())
                            .pgId(review.getPgId())
                            .pgName(pg != null ? pg.getPgname() : "PG")
                            .rating(review.getRating())
                            .comment(review.getComment())
                            .reviewDate(review.getReviewDate())
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}