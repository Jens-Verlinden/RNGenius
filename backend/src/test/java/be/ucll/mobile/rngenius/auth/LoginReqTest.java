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
import be.ucll.mobile.rngenius.auth.model.request.LoginReq;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class LoginReqTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    String validEmail= "john.doe@ucll.be";
    String validPassword = "Password123!";
    LoginReq validLoginReq;

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
        validLoginReq = new LoginReq(validEmail, validPassword);
    }

    @Test
    void givenValidRent_whenCreatingRent_thenNoConstraintViolations() {
        //given
        //when
        //then
        assertNotNull(validLoginReq);
        assertEquals(validEmail, validLoginReq.email);
        assertEquals(validPassword, validLoginReq.password);
        Set<ConstraintViolation<LoginReq>> violations = validator.validate(validLoginReq);
        assertTrue(violations.isEmpty());
    }
}