package be.ucll.mobile.rngenius.user.service;

import java.util.UUID;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import be.ucll.mobile.rngenius.auth.jwt.Secret;
import be.ucll.mobile.rngenius.user.model.User;
import be.ucll.mobile.rngenius.user.model.UserException;
import be.ucll.mobile.rngenius.user.repo.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    protected String ALGORITHM = "AES";
    protected byte[] KEY = Secret.getSecret() != null ? Arrays.copyOf(Secret.getSecret().getBytes(), 32) : new byte[32];

    public UserService() {}

    protected String encrypt(String value) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(KEY, ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        if (value == null) {
            return null;
        }
        byte[] encrypted = cipher.doFinal(value.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    protected String decrypt(String encrypted) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(KEY, ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, keySpec);
        if (encrypted == null) {
            return null;
        }
        byte[] original = cipher.doFinal(Base64.getDecoder().decode(encrypted));
        return new String(original);
    }

    @Transactional
    public User getUserByEmail(String email) throws UserServiceException {
        User user = userRepository.findUserByEmail(email);

        if (user == null) {
            throw new UserServiceException("user", "No user with this email");
        }

        return user;
    }

    @Transactional
    public User getUserById(long id) throws UserServiceException {
        User user = userRepository.findUserById(id);

        if (user == null) {
            throw new UserServiceException("user", "No user with this id");
        }

        return user;
    }

    @Transactional
    public void addUser(User user) throws UserServiceException, UserException {
        if (user == null) {
            throw new UserServiceException("user", "User data is required");
        }

        if (userRepository.findUserByEmail(user.getEmail()) != null) {
            throw new UserServiceException("user", "User with this email already exists");
        }

        String refreshToken = UUID.randomUUID().toString();
        user.setPasswordBcrypt(bCryptPasswordEncoder.encode(user.getPassword()));
        try {
            user.setRefreshToken(encrypt(refreshToken));
        } catch (Exception e) {
            System.out.println(e);
            throw new UserServiceException("refreshToken", "Error encrypting refresh token");
        }
        
        userRepository.save(user);
    }

    public User setRefreshTokenOnLogin(User user) throws UserServiceException, UserException {
        try {
            user.setRefreshToken(decrypt(user.getRefreshToken()));
        } catch (Exception e) {
            throw new UserServiceException("refreshToken", "Error encrypting refresh token");
        }
        return user;
    }

    @Transactional
    public User checkRefreshToken(Long requesterId, String refreshToken) throws UserServiceException {
        User user = getUserById(requesterId);

        try {
            if (!refreshToken.equals(decrypt(user.getRefreshToken()))) {
                throw new UserServiceException("user", "Invalid refresh token");
            }
        } catch (Exception e) {
            throw new UserServiceException("user", e.getMessage());
        }

        return user;
    }

    @Transactional
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
