package com.PgPeekIn.Backend.Repository;

import com.PgPeekIn.Backend.Models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUserIdOrderByReviewDateDesc(Long userId);
}