package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.PhotosModel;
import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Repository.PhotosRepo;
import com.PgPeekIn.Backend.Repository.PgRepo;
import com.PgPeekIn.Backend.Service.SupabaseService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pgowner/photos")
public class OwnerPhotoController {

    private final PgRepo pgRepo;
    private final PhotosRepo photosRepo;
    private final AuthRepository authRepository;
    private final SupabaseService supabaseService;

    @PostMapping("/{pgid}")
    public ResponseEntity<?> uploadPhotos(
            @PathVariable Long pgid,
            @RequestParam("images") MultipartFile[] images,
            Authentication authentication) {

        try {

            // Check authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Unauthorized");
            }

            // Get logged-in user
            String email = authentication.getName();

            User user = authRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check owner role
            if (user.getRole() == null ||
                    !"owner".equalsIgnoreCase(user.getRole())) {

                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only PG owners can upload photos");
            }

            // Find PG
            PgModel pg = pgRepo.findById(pgid)
                    .orElseThrow(() -> new RuntimeException("PG not found"));

            // Make sure PG belongs to logged-in owner
            if (!user.getId().equals(pg.getUserid())) {

                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You are not the owner of this PG");
            }

            // Validate images
            if (images == null || images.length == 0) {
                return ResponseEntity.badRequest()
                        .body("Please select at least one photo");
            }

            int uploadedCount = 0;

            // Upload each image
            for (MultipartFile image : images) {

                if (image == null || image.isEmpty()) {
                    continue;
                }

                String photoUrl =
                        supabaseService.uploadImage(image, pgid);

                PhotosModel photo = new PhotosModel();

                photo.setPhotoPath(photoUrl);
                photo.setPgid(pgid);
                photo.setUploadedAt(LocalDateTime.now());

                photosRepo.save(photo);

                uploadedCount++;
            }

            if (uploadedCount == 0) {
                return ResponseEntity.badRequest()
                        .body("No valid photos were selected");
            }

            return ResponseEntity.ok(
                    "Successfully uploaded " + uploadedCount + " photo(s)"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Photo upload failed: " + e.getMessage());
        }
    }
}