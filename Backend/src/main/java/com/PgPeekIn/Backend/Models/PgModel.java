package com.PgPeekIn.Backend.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

// No change needed here for the image-add fix.
@Entity
@Table(name = "pg", schema = "pgpeekin")
@Getter
@Setter
public class PgModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pg_id")
    private Long pgid;

    @Column(name = "pg_name")
    private String pgname;

    @Column(name = "user_id")
    private Long userid;

    @Column(name = "pg_type")
    private String pgtype;

    @Column(name = "pg_branch")
    private String pgbranch;

    @Column(name = "pg_phnno")
    private String pgphnno;

    @Column(name = "street")
    private String street;

    @Column(name = "area")
    private String area;

    @Column(name = "city")
    private String city;

    @Column(name = "pincode")
    private String pincode;
}
