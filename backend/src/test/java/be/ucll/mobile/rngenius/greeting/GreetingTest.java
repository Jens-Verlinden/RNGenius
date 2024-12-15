package be.ucll.mobile.rngenius.greeting;

import static org.junit.jupiter.api.Assertions.*;

import be.ucll.mobile.rngenius.greeting.model.Greeting;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class GreetingTest {

  private static ValidatorFactory validatorFactory;
  private static Validator validator;

  private String validMessage = "Hello world!";
  private Greeting validGreeting;

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
  public void setUp() {
    validGreeting = new Greeting(validMessage);
  }

  @Test
  void givenValidMessage_whenCreatingGreeting_thenGreetingWithThisMessageIsCreated() {
    // given
    // when
    // then
    assertNotNull(validGreeting);
    assertEquals(validMessage, validGreeting.getMessage());
    Set<ConstraintViolation<Greeting>> violations = validator.validate(validGreeting);
    assertTrue(violations.isEmpty());
  }

  @Test
  void givenEmptyMessage_whenCreatingGreeting_thenErrorIsThrown() {
    // given
    String emptyMessage = "   ";

    // when
    Greeting greeting = new Greeting(emptyMessage);

    // then
    Set<ConstraintViolation<Greeting>> violations = validator.validate(greeting);
    assertEquals(violations.size(), 1);
    ConstraintViolation<Greeting> violation = violations.iterator().next();
    assertEquals("Greeting may not be empty!", violation.getMessage());
    assertEquals("message", violation.getPropertyPath().toString());
    assertEquals(emptyMessage, violation.getInvalidValue());
  }
}
