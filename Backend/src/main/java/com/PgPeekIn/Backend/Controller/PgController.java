package com.PgPeekIn.Backend.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Models.PhotosModel;
import com.PgPeekIn.Backend.Service.PgService;

@RestController
@RequestMapping("/pgowner")
public class PgController {

    @Autowired
    private PgService pgservice;

    // ================= ADD PG (with images) =================
    // No change needed here — this endpoint was already correct.
    // The actual fix is in PgService (transaction) and SupabaseService (content-type).
    @PostMapping("/addpg")
    public String addPg(
            @RequestParam("pgname") String pgname,
            @RequestParam("pgtype") String pgtype,
            @RequestParam("pgbranch") String pgbranch,
            @RequestParam("pgphnno") String pgphnno,
            @RequestParam("street") String street,
            @RequestParam("area") String area,
            @RequestParam("city") String city,
            @RequestParam("pincode") String pincode,
            @RequestParam("images") MultipartFile[] images
    ) throws IOException {

        PgModel pg = new PgModel();

        pg.setPgname(pgname);
        pg.setPgtype(pgtype);
        pg.setPgbranch(pgbranch);
        pg.setPgphnno(pgphnno);
        pg.setStreet(street);
        pg.setArea(area);
        pg.setCity(city);
        pg.setPincode(pincode);

        return pgservice.addPg(pg, images);
    }

    @PutMapping("/updatepg/{pgid}")
    public PgModel updatePg(
            @PathVariable Long pgid,
            @RequestBody PgModel pg) {
        return pgservice.updatepg(pgid, pg);
    }
    @GetMapping("/my-pg")
    public PgModel getMyPg() {
        return pgservice.getMyPg();
    }

    @GetMapping("/user/{userid}")
    public PgModel getByUser(
            @PathVariable Long userid) {
        return pgservice.pgByUser(userid);
    }

    @GetMapping("/search/{location}")
    public List<PgModel> searchPg(
            @PathVariable String location) {
        return pgservice.searchPg(location);
    }

    @GetMapping("/photos/{pgid}")
    public List<PhotosModel> getPgPhotos(
            @PathVariable Long pgid) {
        return pgservice.getPgPhotos(pgid);
    }
}
