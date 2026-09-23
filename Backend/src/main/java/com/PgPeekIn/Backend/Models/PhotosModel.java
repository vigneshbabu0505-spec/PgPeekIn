package com.PgPeekIn.Backend.Models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

// No change needed here for the image-add fix.
@Entity
@Table(name = "photos", schema = "pgpeekin")
@Getter
@Setter
public class PhotosModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoid;

    @Column(name = "photo_path")
    private String photoPath;

    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "pg_id")
    private Long pgid;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Column(name = "f_id")
    private Long fid;

    @Column(name = "review_photo_path")
    private String reviewPhotoPath;
}
