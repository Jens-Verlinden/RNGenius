package be.mobile.rngenius.auth;

import static org.junit.jupiter.api.Assertions.*;

import be.mobile.rngenius.auth.model.request.PasswdReq;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class PasswdReqJava {

  private static ValidatorFactory validatorFactory;
  private static Validator validator;

  String oldPassword = "oldPass";
  String newPassword = "newPass";
  PasswdReq validPasswdReq;

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
    validPasswdReq = new PasswdReq(oldPassword, newPassword);
  }

  @Test
  void givenValidPasswdReq_whenCreatingPasswdReq_thenNoConstraintViolations() {
    assertNotNull(validPasswdReq);
    assertEquals(oldPassword, validPasswdReq.oldPassword);
    assertEquals(newPassword, validPasswdReq.newPassword);
    Set<ConstraintViolation<PasswdReq>> violations = validator.validate(validPasswdReq);
    assertTrue(violations.isEmpty());
  }
}
