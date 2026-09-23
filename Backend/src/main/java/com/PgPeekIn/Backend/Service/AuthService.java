package com.PgPeekIn.Backend.Service;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService
{
    @Autowired
    private AuthRepository userRepository;

    public User createUser(User user)
    {
        return userRepository.save(user);
    }

    public User getProfile(String email)
    {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not found"));
    }

    public User updateProfile(User user)
    {
        return userRepository.saveAndFlush(user);
    }
}