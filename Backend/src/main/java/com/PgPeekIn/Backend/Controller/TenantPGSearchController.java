package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Models.Room;
import com.PgPeekIn.Backend.Repository.PgRepo;
import com.PgPeekIn.Backend.Repository.RoomRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tenant/search")
public class TenantPGSearchController {

    @Autowired
    private PgRepo pgRepo;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<PgModel> searchPGs(
            @RequestParam(required = false, defaultValue = "") String location,
            @RequestParam(required = false) Integer sharingType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {

        List<PgModel> pgs;

        // Search PGs by location
        if (location == null || location.trim().isEmpty()) {
            pgs = pgRepo.findAll();
        } else {
            pgs = pgRepo.searchByLocation(location.trim());
        }

        List<PgModel> filteredPGs = new ArrayList<>();

        for (PgModel pg : pgs) {

            // If no room filters are selected,
            // keep the PG in the result.
            if (sharingType == null && minPrice == null && maxPrice == null) {
                filteredPGs.add(pg);
                continue;
            }

            List<Room> rooms = roomRepository.findByPgId(pg.getPgid());

            boolean matchingRoom = rooms.stream().anyMatch(room -> {

                // Sharing type filter
                if (sharingType != null) {
                    if (room.getSharingType() == null ||
                            !room.getSharingType().equals(sharingType)) {
                        return false;
                    }
                }

                // Monthly rent
                BigDecimal rent = room.getMonthlyRent();

                if (rent == null) {
                    return false;
                }

                // Minimum price
                if (minPrice != null && rent.compareTo(minPrice) < 0) {
                    return false;
                }

                // Maximum price
                if (maxPrice != null && rent.compareTo(maxPrice) > 0) {
                    return false;
                }

                return true;
            });

            if (matchingRoom) {
                filteredPGs.add(pg);
            }
        }

        return filteredPGs;
    }
}