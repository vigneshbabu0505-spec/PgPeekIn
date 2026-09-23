package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Repository.PgRepo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenant/pg")
public class TenantPGController {

    @Autowired
    private PgRepo pgRepo;


    // =========================================================
    // GET SELECTED PG DETAILS
    // =========================================================

    @GetMapping("/{pgid}")
    public ResponseEntity<PgModel> getPGDetails(
            @PathVariable Long pgid) {

        PgModel pg = pgRepo.findById(pgid)
                .orElseThrow(() ->
                        new RuntimeException("PG not found"));

        return ResponseEntity.ok(pg);
    }

}