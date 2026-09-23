package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.PhotosModel;
import com.PgPeekIn.Backend.Repository.PhotosRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenant/pg")
public class TenantPGPhotoController {

    @Autowired
    private PhotosRepo photosRepo;

    @GetMapping("/{pgid}/photos")
    public List<PhotosModel> getPGPhotos(
            @PathVariable Long pgid) {

        return photosRepo.findByPgid(pgid);
    }
}