package be.ucll.mobile.rngenius.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import be.ucll.mobile.rngenius.auth.model.response.LoginRes;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class LoginResTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    String validMessage = "Authentication successful...";
    String validToken = "eyJhbG.njudfkngnidsfgn.bhusdfjhfsuh";
    String validRefreshToken = "1c6c9b09-c4e6-4d42-9aa8-8495208b425f";
    long validId = 1;
    String validEmail = "email";

    LoginRes validLoginRes;;

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
        validLoginRes = new LoginRes(validMessage, validToken, validRefreshToken, validId, validEmail);
    }

    @Test
    void givenValidRent_whenCreatingRent_thenNoConstraintViolations() {
        //given
        //when
        //then
        assertNotNull(validLoginRes);
        assertEquals(validMessage, validLoginRes.message);
        assertEquals(validToken, validLoginRes.accessToken);
        assertEquals(validRefreshToken, validLoginRes.refreshToken);
        assertEquals(validId, validLoginRes.id);
        assertEquals(validEmail, validLoginRes.email);
        Set<ConstraintViolation<LoginRes>> violations = validator.validate(validLoginRes);
        assertTrue(violations.isEmpty());
    }
}