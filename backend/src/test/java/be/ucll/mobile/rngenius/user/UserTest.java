package be.ucll.mobile.rngenius.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import be.ucll.mobile.rngenius.user.model.User;
import be.ucll.mobile.rngenius.user.model.UserException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class UserTest {
    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    String validFirstName = "John";
    String validLastName = "Doe";
    String validEmail = "john.doe@ucll.be";
    String validPassword = "John123!";
    String validRefreshToken = "validRefreshToken";

    User validUser;

    @BeforeAll
    public static void createValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    public static void close() {
        validatorFactory.close();
    }

    @BeforeEach
    public void setUp() throws Exception {
        validUser = new User(validFirstName, validLastName, validEmail, validPassword);
        validUser.setRefreshToken(validRefreshToken);
    }

    @Test
    void givenValidValues_whenCreatingUser_thenUserIsCreated() {
        assertNotNull(validUser);
        assertEquals(validFirstName, validUser.getFirstName());
        assertEquals(validLastName, validUser.getLastName());
        assertEquals(validEmail, validUser.getEmail());
        assertEquals(validPassword, validUser.getPassword());
        assertEquals(validRefreshToken, validUser.getRefreshToken());
    }

    @Test
    void givenEmptyFirstName_whenCreatingUser_thenExceptionIsThrown() throws Exception {
        String emptyFirstName = "";

        User user = new User(emptyFirstName, validLastName, validEmail, validPassword);

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertEquals(violations.size(), 1);
        ConstraintViolation<User> violation = violations.iterator().next();
        assertEquals("First name is required", violations.iterator().next().getMessage());
        assertEquals("firstName", violation.getPropertyPath().toString());
        assertEquals(emptyFirstName, violation.getInvalidValue());
    }

    @Test
    void givenEmptyLastName_whenCreatingUser_thenExceptionIsThrown() throws Exception {
        String emptyLastName = "";

        User user = new User(validFirstName, emptyLastName, validEmail, validPassword);

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertEquals(violations.size(), 1);
        ConstraintViolation<User> violation = violations.iterator().next();
        assertEquals("Last name is required", violations.iterator().next().getMessage());
        assertEquals("lastName", violation.getPropertyPath().toString());
        assertEquals(emptyLastName, violation.getInvalidValue());
    }

    @Test
    void givenEmptyEmail_whenCreatingUser_thenExceptionIsThrown() throws Exception {
        String emptyEmail = "";

        User user = new User(validFirstName, validLastName, emptyEmail, validPassword);

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertEquals(violations.size(), 2);
        List<String> violationsList = new ArrayList<>();
        ConstraintViolation<User> violation = violations.iterator().next();
        assertEquals("email", violation.getPropertyPath().toString());
        violations.forEach(v -> violationsList.add(v.getMessage()));
        assertTrue(violationsList.contains("Email is required"));
        assertTrue(violationsList.contains("Email value is invalid, it has to be of the following format xxx@yyy.zzz"));
        assertEquals(emptyEmail, violation.getInvalidValue());
    }

    @Test
    void givenEmptyPassword_whenCreatingUser_thenThrowException() throws Exception {

        String emptyPassword = "";

        UserException ex = Assertions.assertThrows(UserException.class,
                () -> new User(validFirstName, validLastName, validEmail, emptyPassword));

        assertEquals("password", ex.getField());
        assertEquals("Password is required", ex.getMessage());
    }

    @Test
    void givenShortPassword_whenCreatingUser_thenThrowException() throws Exception {

        String shortPassword = "Pass12";

        UserException ex = Assertions.assertThrows(UserException.class,
                () -> new User(validFirstName, validLastName, validEmail, shortPassword));

        assertEquals("password", ex.getField());
        assertEquals("Password is too short, it has to be at least 8 characters long", ex.getMessage());
    }

    @Test
    void givenPasswordWithoutUppercaseLetter_whenCreatingUser_thenThrowException() throws Exception {

        String shortPassword = "password123!";

        UserException ex = Assertions.assertThrows(UserException.class,
                () -> new User(validFirstName, validLastName, validEmail, shortPassword));

        assertEquals("password", ex.getField());
        assertEquals("Password has to contain at least one uppercase letter", ex.getMessage());
    }

    @Test
    void givenPasswordWithoutLowercaseLetter_whenCreatingUser_thenThrowException() throws Exception {

        String shortPassword = "PASSWORD123!";

        UserException ex = Assertions.assertThrows(UserException.class,
                () -> new User(validFirstName, validLastName, validEmail, shortPassword));

        assertEquals("password", ex.getField());
        assertEquals("Password has to contain at least one lowercase letter", ex.getMessage());
    }

    @Test
    void givenPasswordWithoutNumber_whenCreatingUser_thenThrowException() throws Exception {

        String shortPassword = "Password!";

        UserException ex = Assertions.assertThrows(UserException.class,
                () -> new User(validFirstName, validLastName, validEmail, shortPassword));

        assertEquals("password", ex.getField());
        assertEquals("Password has to contain at least one number", ex.getMessage());
    }

    @Test
    void givenPasswordWithoutSpecialCharacter_whenCreatingUser_thenThrowException() throws Exception {

        String shortPassword = "Password123";

        UserException ex = Assertions.assertThrows(UserException.class,
                () -> new User(validFirstName, validLastName, validEmail, shortPassword));

        assertEquals("password", ex.getField());
        assertEquals("Password has to contain at least one special character", ex.getMessage());
    }

    @Test
    void givenValidRefreshToken_whenSettingRefreshToken_thenTokenIsSet() throws Exception {
        String newRefreshToken = "newValidRefreshToken";
        validUser.setRefreshToken(newRefreshToken);
        assertEquals(newRefreshToken, validUser.getRefreshToken());
    }

    @Test
    void givenNullRefreshToken_whenSettingRefreshToken_thenThrowException() {
        UserException ex = Assertions.assertThrows(UserException.class,
                () -> validUser.setRefreshToken(null));

        assertEquals("refreshToken", ex.getField());
        assertEquals("Refresh token is required", ex.getMessage());
    }

    @Test
    void givenEmptyRefreshToken_whenSettingRefreshToken_thenThrowException() {
        String emptyRefreshToken = "";

        UserException ex = Assertions.assertThrows(UserException.class,
                () -> validUser.setRefreshToken(emptyRefreshToken));

        assertEquals("refreshToken", ex.getField());
        assertEquals("Refresh token is required", ex.getMessage());
    }
}
