package com.PgPeekIn.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PgPeekIn.Backend.Models.PhotosModel;

// No change needed here for the image-add fix.
public interface PhotosRepo extends JpaRepository<PhotosModel, Long> {

    List<PhotosModel> findByPgid(Long pgid);
}
