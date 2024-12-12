package be.ucll.mobile.rngenius.auth.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import be.ucll.mobile.rngenius.auth.jwt.JwtUtil;
import be.ucll.mobile.rngenius.auth.model.request.LoginReq;
import be.ucll.mobile.rngenius.auth.model.request.PasswdReq;
import be.ucll.mobile.rngenius.auth.model.request.RefreshReq;
import be.ucll.mobile.rngenius.auth.model.response.ErrorRes;
import be.ucll.mobile.rngenius.auth.model.response.LoginRes;
import be.ucll.mobile.rngenius.auth.model.response.RefreshRes;
import be.ucll.mobile.rngenius.user.model.User;
import be.ucll.mobile.rngenius.user.model.UserException;
import be.ucll.mobile.rngenius.user.service.UserService;
import be.ucll.mobile.rngenius.user.service.UserServiceException;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/auth")
public class AuthRestController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) throws UserServiceException, UserException {
        userService.addUser(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq loginReq) {

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginReq.email, loginReq.password));
            String email = "";
            if (authentication != null) email = authentication.getName();
            User loggedInUser = userService.getUserByEmail(email);
            User user = userService.setRefreshTokenOnLogin(loggedInUser);
            String token = jwtUtil.createToken(user);
            LoginRes loginRes = new LoginRes("Authentication successful...", token, user.getRefreshToken(), user.id, user.getEmail(), user.getFirstName(), user.getLastName());
            return ResponseEntity.ok(loginRes);

        } catch (BadCredentialsException e){
            ErrorRes errorResponse = new ErrorRes("credentials", "Incorrect password for user with the e-mail " + loginReq.email + "!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e){
            ErrorRes errorResponse = new ErrorRes("credentials", "User with e-mail " + loginReq.email + " not found!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PutMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshReq refreshReq) {
        try {
            Long requesterId = jwtUtil.retrieveRequesterId(refreshReq.accessToken);
            User user = userService.checkRefreshToken(requesterId, refreshReq.refreshToken);
            String token = jwtUtil.createToken(user);
            RefreshRes loginRes = new RefreshRes("Token refreshed...", token, user.id, user.getEmail());
            return ResponseEntity.ok(loginRes);
        } catch (UserServiceException e) {
            ErrorRes errorResponse = new ErrorRes("refreshToken", "Invalid refresh token!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody PasswdReq passwdReq, @RequestHeader("Authorization") String token) throws UserServiceException, UserException {
        Long requesterId = jwtUtil.retrieveRequesterId(token);
        userService.changePassword(requesterId, passwdReq.oldPassword, passwdReq.newPassword);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/logoutAllDevices")
    public ResponseEntity<String> logoutAllDevices(@RequestHeader("Authorization") String token) throws UserServiceException {
        Long requesterId = jwtUtil.retrieveRequesterId(token);
        userService.logoutAllDevices(requesterId);
        return ResponseEntity.ok().build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ MethodArgumentNotValidException.class})
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put("field", fieldName);
            errors.put("message", errorMessage);
        });
        return errors;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ UserServiceException.class})
    public Map<String, String> handleServiceExceptions(UserServiceException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("field", ex.getField());
        errors.put("message", ex.getMessage());
        return errors;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ UserException.class})
    public Map<String, String> handleServiceExceptions(UserException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("field", ex.getField());
        errors.put("message", ex.getMessage());
        return errors;
    }  
}
