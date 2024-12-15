package be.ucll.mobile.rngenius.option;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import be.ucll.mobile.rngenius.option.model.Option;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class OptionTest {
  private static ValidatorFactory validatorFactory;
  private static Validator validator;

  String validName = "Option1";
  List<String> validCategories = new ArrayList<>(List.of("Category1", "Category2"));
  String validDescription = "This is a valid description";

  Option validOption;

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
    validOption = new Option(validName, validCategories, validDescription);
  }

  @Test
  void givenValidValues_whenCreatingOption_thenOptionIsCreated() {
    assertNotNull(validOption);
    assertEquals(validName, validOption.getName());
    assertEquals(validCategories, validOption.getCategories());
    assertEquals(validDescription, validOption.getDescription());
  }

  @Test
  void givenEmptyName_whenCreatingOption_thenExceptionIsThrown() throws Exception {
    String emptyName = "";

    Option option = new Option(emptyName, validCategories, validDescription);

    Set<ConstraintViolation<Option>> violations = validator.validate(option);
    assertEquals(violations.size(), 1);
    ConstraintViolation<Option> violation = violations.iterator().next();
    assertEquals("Name is required", violations.iterator().next().getMessage());
    assertEquals("name", violation.getPropertyPath().toString());
    assertEquals(emptyName, violation.getInvalidValue());
  }

  @Test
  void givenEmptyCategories_whenCreatingOption_thenExceptionIsThrown() {
    List<String> emptyCategories = new ArrayList<>();

    Option option = new Option(validName, emptyCategories, validDescription);

    Set<ConstraintViolation<Option>> violations = validator.validate(option);
    assertEquals(violations.size(), 1);
    ConstraintViolation<Option> violation = violations.iterator().next();
    assertEquals("At least one category is required", violations.iterator().next().getMessage());
    assertEquals("categories", violation.getPropertyPath().toString());
    assertEquals(emptyCategories, violation.getInvalidValue());
  }

  @Test
  void givenEmptyDescription_whenCreatingOption_thenOptionIsCreated() {
    String emptyDescription = "";

    Option option = new Option(validName, validCategories, emptyDescription);

    assertNotNull(option);
    assertEquals(validName, option.getName());
    assertEquals(validCategories, option.getCategories());
    assertEquals(emptyDescription, option.getDescription());
  }

  @Test
  void givenValidCategory_whenRemovingCategory_thenCategoryIsRemoved() {
    String categoryToRemove = "Category1";
    validOption.removeCategory(categoryToRemove);
    assertTrue(!validOption.getCategories().contains(categoryToRemove));
  }
}
