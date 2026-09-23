package com.PgPeekIn.Backend.Service;

import com.PgPeekIn.Backend.Models.TenantPhoto;
import com.PgPeekIn.Backend.Repository.TenantPhotoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class TenantPhotoService {

    @Autowired
    private TenantPhotoRepository photoRepository;

    // Owner PG photo
    public TenantPhoto savePgPhoto(Long pgId, String photoUrl) {

        TenantPhoto photo = new TenantPhoto();

        photo.setPgId(pgId);
        photo.setReviewId(null);
        photo.setPhotoPath(photoUrl);
        photo.setUploadedAt(OffsetDateTime.now());

        return photoRepository.save(photo);
    }

    // Tenant review photo
    public TenantPhoto saveReviewPhoto(
            Long pgId,
            Long reviewId,
            String photoUrl) {

        TenantPhoto photo = new TenantPhoto();

        photo.setPgId(pgId);
        photo.setReviewId(reviewId);
        photo.setPhotoPath(photoUrl);
        photo.setUploadedAt(OffsetDateTime.now());

        return photoRepository.save(photo);
    }
}