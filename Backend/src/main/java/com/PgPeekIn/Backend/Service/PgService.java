package com.PgPeekIn.Backend.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Models.PhotosModel;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.PgRepo;
import com.PgPeekIn.Backend.Repository.PhotosRepo;

@Service
public class PgService {

    @Autowired
    private PgRepo pgrepo;

    @Autowired
    private AuthService authService;

    @Autowired
    private PhotosRepo photosRepo;

    @Autowired
    private SupabaseService supabaseService;

    // =====================================================
    // ADD PG
    // =====================================================

    public PgModel addPg(PgModel pg) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = authService.getProfile(email);

        pg.setUserid(user.getId());

        PgModel existingPg =
                pgrepo.findByUserid(pg.getUserid());

        if (existingPg != null) {
            return null;
        }

        return pgrepo.save(pg);
    }

    // =====================================================
    // ADD PG WITH IMAGES
    // =====================================================

    @Transactional
    public String addPg(
            PgModel pg,
            MultipartFile[] images
    ) throws IOException {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = authService.getProfile(email);

        pg.setUserid(user.getId());

        PgModel existingPg =
                pgrepo.findByUserid(pg.getUserid());

        if (existingPg != null) {
            return "You already have a PG";
        }

        PgModel savedPg = pgrepo.save(pg);

        if (images != null) {

            for (MultipartFile image : images) {

                if (image == null || image.isEmpty()) {
                    continue;
                }

                System.out.println(
                        "IMAGE RECEIVED = "
                                + image.getOriginalFilename()
                );

                String imageUrl =
                        supabaseService.uploadImage(
                                image,
                                savedPg.getPgid()
                        );

                System.out.println(
                        "IMAGE UPLOADED = "
                                + imageUrl
                );

                PhotosModel photo =
                        new PhotosModel();

                photo.setPhotoPath(imageUrl);
                photo.setReviewId(null);
                photo.setPgid(savedPg.getPgid());
                photo.setUploadedAt(LocalDateTime.now());
                

                photosRepo.save(photo);

                System.out.println(
                        "PHOTO TABLE SAVED"
                );
            }
        }

        return "PG added successfully";
    }

    // =====================================================
    // UPDATE PG
    // =====================================================

    public PgModel updatepg(Long id, PgModel pg) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = authService.getProfile(email);

        PgModel existingPg =
                pgrepo.findById(id)
                        .orElse(null);

        if (existingPg == null) {
            return null;
        }

        if (!existingPg.getUserid().equals(user.getId())) {
            return null;
        }

        existingPg.setPgname(pg.getPgname());
        existingPg.setPgtype(pg.getPgtype());
        existingPg.setPgbranch(pg.getPgbranch());
        existingPg.setPgphnno(pg.getPgphnno());
        existingPg.setStreet(pg.getStreet());
        existingPg.setArea(pg
        .getArea());
        existingPg.setCity(pg.getCity());
        existingPg.setPincode(pg.getPincode());

        return pgrepo.save(existingPg);
    }

    // =====================================================
    // TENANT PG SEARCH
    // =====================================================

    public List<PgModel> searchPg(String location) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = authService.getProfile(email);

        List<PgModel> pgs =
                pgrepo.searchByLocation(location);

        List<PgModel> result =
                new ArrayList<>();

        if (user.getGender() == null) {
            return result;
        }

        String tenantGender =
                user.getGender()
                        .trim()
                        .toLowerCase();

        for (PgModel pg : pgs) {

            if (pg.getPgtype() == null) {
                continue;
            }

            String pgType =
                    pg.getPgtype()
                            .trim()
                            .toLowerCase();

            if (
                    tenantGender.equals("male")
                    && pgType.equals("mens")
            ) {

                result.add(pg);

            } else if (
                    tenantGender.equals("female")
                    && (
                        pgType.equals("female")
                        || pgType.equals("womens")
                    )
            ) {

                result.add(pg);
            }
        }

        return result;
    }

    // =====================================================
    // GET PG BY OWNER
    // =====================================================

    public PgModel pgByUser(Long id) {

        return pgrepo.findByUserid(id);
    }

    // =====================================================
    // GET CURRENT OWNER PG
    // =====================================================

    public PgModel getMyPg() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = authService.getProfile(email);

        return pgrepo.findByUserid(user.getId());
    }

    // =====================================================
    // GET PG BY PG ID
    // =====================================================

    public PgModel pgById(Long id) {

        return pgrepo.findById(id)
                .orElse(null);
    }

    // =====================================================
    // GET PG PHOTOS
    // =====================================================

    public List<PhotosModel> getPgPhotos(Long pgid) {

        return photosRepo.findByPgid(pgid);
    }
}