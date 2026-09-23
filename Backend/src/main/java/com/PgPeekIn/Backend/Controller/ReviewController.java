package com.PgPeekIn.Backend.Controller;
import com.PgPeekIn.Backend.Repository.BookingRepository;
import com.PgPeekIn.Backend.Models.TenantPhoto;
import com.PgPeekIn.Backend.Models.Review;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Service.ReviewService;
import com.PgPeekIn.Backend.Service.TenantPhotoService;
import com.PgPeekIn.Backend.Service.TenantSupabaseStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/pgs")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private TenantPhotoService photoService;

    @Autowired
    private TenantSupabaseStorageService supabaseStorageService;


    @PostMapping(
            value = "/{pgId}/reviews",
            consumes = "multipart/form-data"
    )
    public Review submitReview(
            @PathVariable Long pgId,
            @RequestParam Long bookingId,
            @RequestParam Integer rating,
            @RequestParam String comment,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            Authentication authentication) throws Exception {

        String email = authentication.getName();

        User user = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Long userId = user.getId();

        // Existing review logic
        Review review = new Review();

        review.setPgId(pgId);
        review.setBookingId(bookingId);
        review.setUserId(userId);
        review.setRating(rating);
        review.setComment(comment);

        // Review save → review_id generated
        Review savedReview = reviewService.submitReview(review);

        // Photo save
        if (photo != null && !photo.isEmpty()) {

            String photoUrl =
                    supabaseStorageService.uploadImage(photo);

            photoService.saveReviewPhoto(
                    pgId,
                    savedReview.getReviewId(),
                    photoUrl
            );
        }

        return savedReview;
    }
    @PostMapping("/{pgId}/reviews/{reviewId}/photo")
    public TenantPhoto uploadReviewPhoto(
            @PathVariable Long pgId,
            @PathVariable Long reviewId,
            @RequestParam("photo") MultipartFile photo
    ) throws Exception {

        String photoUrl = supabaseStorageService.uploadImage(photo);

        return photoService.saveReviewPhoto(
                pgId,
                reviewId,
                photoUrl
        );
    }

    @GetMapping("/{pgId}/reviews")
    public List<Review> getReviews(
            @PathVariable Long pgId) {

        return reviewService.getReviewsByPg(pgId);
    }
    @Autowired
    private com.PgPeekIn.Backend.Repository.TenantPhotoRepository photoRepository;

    @GetMapping("/{pgId}/reviews/{reviewId}/photo")
    public List<TenantPhoto> getReviewPhotos(
            @PathVariable Long pgId,
            @PathVariable Long reviewId) {

        return photoRepository.findByReviewId(reviewId);
    }
}