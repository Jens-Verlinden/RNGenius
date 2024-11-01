package be.ucll.mobile.rngenius.user.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import be.ucll.mobile.rngenius.user.model.User;
import be.ucll.mobile.rngenius.user.model.UserException;
import be.ucll.mobile.rngenius.user.repo.UserRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService() {}
    
    public User getUserByEmail(String email) throws UserServiceException {
        User user = userRepository.findUserByEmail(email);

        if (user == null) {
            throw new UserServiceException("user", "No user with this email");
        }

        return user;
    }

    public User getUserById(long id) throws UserServiceException {
        User user = userRepository.findUserById(id);

        if (user == null) {
            throw new UserServiceException("user", "No user with this id");
        }

        return user;
    }

    public void addUser(User user) throws UserServiceException, UserException {
        if (user == null) {
            throw new UserServiceException("user", "User data is required");
        }

        if (userRepository.findUserByEmail(user.getEmail()) != null) {
            throw new UserServiceException("user", "User with this email already exists");
        }

        String refreshToken = UUID.randomUUID().toString();

        user.setPasswordBcrypt(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRefreshToken(bCryptPasswordEncoder.encode(refreshToken));
        
        userRepository.save(user);
    };

    public User setRefreshTokenOnLogin(User user) throws UserException {
        String refreshToken = UUID.randomUUID().toString();
        user.setRefreshToken(bCryptPasswordEncoder.encode(refreshToken));
        userRepository.save(user);
        user.setRefreshToken(refreshToken);
        return user;
    }

    public User checkRefreshToken(Long requesterId, String refreshToken) throws UserServiceException {
        User user = getUserById(requesterId);

        if (!bCryptPasswordEncoder.matches(refreshToken, user.getRefreshToken())) {
            throw new UserServiceException("user", "Invalid refresh token");
        }

        return user;
    }

    public void changePassword(Long requesterId, String oldPassword, String newPassword) throws UserServiceException, UserException {
        User user = getUserById(requesterId);

        if (!bCryptPasswordEncoder.matches(oldPassword, user.getPassword())) {
            throw new UserServiceException("user", "Invalid password");
        }
        
        user.setPassword(newPassword);
        user.setPasswordBcrypt(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
