package com.PgPeekIn.Backend.Repository;



import com.PgPeekIn.Backend.Models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPgId(Long pgId);
}