package be.ucll.mobile.rngenius.auth;

import static org.junit.jupiter.api.Assertions.*;

import be.ucll.mobile.rngenius.auth.model.request.RefreshReq;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class RefreshReqTest {

  private static ValidatorFactory validatorFactory;
  private static Validator validator;

  String refreshToken = "token123";
  String accessToken = "accessToken123";
  RefreshReq validRefreshReq;

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
    validRefreshReq = new RefreshReq(refreshToken, accessToken);
  }

  @Test
  void givenValidRefreshReq_whenCreatingRefreshReq_thenNoConstraintViolations() {
    assertNotNull(validRefreshReq);
    assertEquals(refreshToken, validRefreshReq.refreshToken);
    assertEquals(accessToken, validRefreshReq.accessToken);
    Set<ConstraintViolation<RefreshReq>> violations = validator.validate(validRefreshReq);
    assertTrue(violations.isEmpty());
  }
}
