package com.PgPeekIn.Backend.Service;

import com.PgPeekIn.Backend.Models.Review;
import com.PgPeekIn.Backend.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review submitReview(Review review) {

        review.setReviewDate(LocalDate.now().atStartOfDay());

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByPg(Long pgId) {

        return reviewRepository.findByPgId(pgId);
    }
}