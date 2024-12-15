package be.ucll.mobile.rngenius.auth;

import static org.junit.jupiter.api.Assertions.*;

import be.ucll.mobile.rngenius.auth.model.response.RefreshRes;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class RefreshResTest {

  private static ValidatorFactory validatorFactory;
  private static Validator validator;

  String message = "Success";
  String accessToken = "token123";
  long id = 1L;
  String email = "test@example.com";
  RefreshRes validRefreshRes;

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
    validRefreshRes = new RefreshRes(message, accessToken, id, email);
  }

  @Test
  void givenValidRefreshRes_whenCreatingRefreshRes_thenNoConstraintViolations() {
    assertNotNull(validRefreshRes);
    assertEquals(message, validRefreshRes.message);
    assertEquals(accessToken, validRefreshRes.accessToken);
    assertEquals(id, validRefreshRes.id);
    assertEquals(email, validRefreshRes.email);
    Set<ConstraintViolation<RefreshRes>> violations = validator.validate(validRefreshRes);
    assertTrue(violations.isEmpty());
  }
}
