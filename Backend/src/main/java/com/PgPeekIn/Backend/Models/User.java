package com.PgPeekIn.Backend.Models;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="users", schema = "pgpeekin")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    Long id;
    @NotBlank
    String user_name;
    @NotBlank
    String user_phone;
    @NotBlank
    String gender;
    String occupation;
    @NotBlank
    String role;
    @Email
    @Column(name = "user_email")
    @NotBlank
    String email;
    @NotBlank
    String user_password;
}
