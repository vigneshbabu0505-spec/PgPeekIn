package com.PgPeekIn.Backend.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "photos", schema = "pgpeekin")
@Getter
@Setter
public class TenantPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    @Column(name = "photo_path")
    private String photoPath;

    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "pg_id")
    private Long pgId;

    @Column(name = "uploaded_at")
    private OffsetDateTime uploadedAt;
}