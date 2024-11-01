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

import be.ucll.mobile.rngenius.auth.model.response.ErrorRes;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class ErrorResTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    String validField = "credentials";
    String validMessage = "Invalid username or password";
    ErrorRes validErrorRes;

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
        validErrorRes = new ErrorRes(validField, validMessage);
    }

    @Test
    void givenValidRent_whenCreatingRent_thenNoConstraintViolations() {
        //given
        //when
        //then
        assertNotNull(validErrorRes);
        assertEquals(validField, validErrorRes.field);
        assertEquals(validMessage, validErrorRes.message);
        Set<ConstraintViolation<ErrorRes>> violations = validator.validate(validErrorRes);
        assertTrue(violations.isEmpty());
    }
}