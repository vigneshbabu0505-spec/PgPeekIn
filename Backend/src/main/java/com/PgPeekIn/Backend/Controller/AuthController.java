package com.PgPeekIn.Backend.Controller;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Service.AuthService;
import com.PgPeekIn.Backend.Utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("PgPeekIn/users")
public class AuthController
{
    private final AuthRepository userRepository;
    private final AuthService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String,String> body)
    {
        String user_name = body.get("name");
        String user_phone = body.get("phone");
        String gender = body.get("gender");
        String occupation = body.get("occupation");
        String role = body.get("role");
        String user_email = body.get("email");
        String user_password=passwordEncoder.encode(body.get("user_password"));

        if(userRepository.findByEmail(user_email).isPresent())
        {
            return new ResponseEntity<>("Email already Exists", HttpStatus.CONFLICT);
        }
        User user = User.builder()
                .user_name(user_name)
                .user_phone(user_phone)
                .gender(gender)
                .occupation(occupation)
                .role(role)
                .email(user_email)
                .user_password(user_password)
                .build();
        userService.createUser(user);
        return new ResponseEntity<>("Successfully Register", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String,String> body)    // ? denote any datatype
    {
        String email=body.get("email");
        String user_password=body.get("user_password");

        var userOptional=userRepository.findByEmail(email);
        if(userOptional.isEmpty())
        {
            return new ResponseEntity<>("User not Registered", HttpStatus.UNAUTHORIZED);
        }
        User user=userOptional.get();
        if(!passwordEncoder.matches(user_password,user.getUser_password()))
        {
            return new ResponseEntity<>("Invalid User", HttpStatus.UNAUTHORIZED);
        }
       String token = jwtUtil.generateToken(email, user.getRole());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole(),
                "user_name", user.getUser_name(),
                "email", user.getEmail()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser()
    {
        return new ResponseEntity<>("Successfully Logout", HttpStatus.CONFLICT);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication)
    {
        if(authentication == null || !authentication.isAuthenticated())
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unauthorized");
        }
        String email = authentication.getName();
        User user = userService.getProfile(email);
        Map<String, Object> profile = new HashMap<>();
        profile.put("user_name", user.getUser_name());
        profile.put("user_phone", user.getUser_phone());
        profile.put("gender", user.getGender());
        profile.put("occupation", user.getOccupation());
        profile.put("role", user.getRole());
        profile.put("email", user.getEmail());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(Authentication authentication,@RequestBody Map<String, String> body)
    {
        if (authentication==null || !authentication.isAuthenticated())
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        String email = authentication.getName();
        User user = userService.getProfile(email);
        if(body.get("user_name")!=null)
        {
            user.setUser_name(body.get("user_name"));
        }
        if(body.get("user_phone")!=null)
        {
            user.setUser_phone(body.get("user_phone"));
        }
        if(body.get("gender")!=null)
        {
            user.setGender(body.get("gender"));
        }
        if(body.get("occupation")!=null)
        {
            user.setOccupation(body.get("occupation"));
        }
        userService.updateProfile(user);
        return new ResponseEntity<>("Successfully Updated", HttpStatus.OK);
    }
}
