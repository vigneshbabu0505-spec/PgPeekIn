package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.OwnerDashboardResponse;
import com.PgPeekIn.Backend.Service.OwnerDashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/PgPeekIn/owner")
@CrossOrigin
public class OwnerDashboardController {

    @Autowired
    private OwnerDashboardService ownerDashboardService;


    @GetMapping("/dashboard")
    public OwnerDashboardResponse getDashboard(
            Authentication authentication) {

        String ownerEmail =
                authentication.getName();

        return ownerDashboardService
                .getDashboard(ownerEmail);
    }
}