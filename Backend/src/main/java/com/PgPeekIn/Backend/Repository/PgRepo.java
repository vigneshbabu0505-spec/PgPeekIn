package com.PgPeekIn.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.PgPeekIn.Backend.Models.PgModel;

public interface PgRepo extends JpaRepository<PgModel, Long> {

    PgModel findByUserid(Long userid);

    List<PgModel> findAllByUserid(Long userid);

    List<PgModel> findByAreaOrCity(
            String area,
            String city
    );

    @Query("""
        SELECT p
        FROM PgModel p
        WHERE LOWER(p.area) LIKE LOWER(CONCAT('%', :location, '%'))
           OR LOWER(p.city) LIKE LOWER(CONCAT('%', :location, '%'))
           OR LOWER(p.pgname) LIKE LOWER(CONCAT('%', :location, '%'))
           OR LOWER(p.pgbranch) LIKE LOWER(CONCAT('%', :location, '%'))
           OR LOWER(p.street) LIKE LOWER(CONCAT('%', :location, '%'))
           OR LOWER(p.pgtype) LIKE LOWER(CONCAT('%', :location, '%'))
    """)
    List<PgModel> searchByLocation(
            @Param("location") String location
    );


    
}