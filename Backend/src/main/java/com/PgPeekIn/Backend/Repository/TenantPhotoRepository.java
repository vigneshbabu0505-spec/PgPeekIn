package com.PgPeekIn.Backend.Repository;

import com.PgPeekIn.Backend.Models.TenantPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TenantPhotoRepository extends JpaRepository<TenantPhoto, Long> {

    List<TenantPhoto> findByPgId(Long pgId);

    List<TenantPhoto> findByReviewId(Long reviewId);
}