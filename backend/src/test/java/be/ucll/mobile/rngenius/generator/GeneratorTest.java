package be.ucll.mobile.rngenius.generator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import be.ucll.mobile.rngenius.generator.model.Generator;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class GeneratorTest {
    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    String validTitle = "Generator1";
    int validIconNumber = 1;

    Generator validGenerator;

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
        validGenerator = new Generator(validTitle, validIconNumber);
    }

    @Test
    void givenValidValues_whenCreatingGenerator_thenGeneratorIsCreated() {
        assertNotNull(validGenerator);
        assertEquals(validTitle, validGenerator.getTitle());
        assertEquals(validIconNumber, validGenerator.getIconNumber());
    }

    @Test
    void givenEmptyTitle_whenCreatingGenerator_thenExceptionIsThrown() throws Exception {
        String emptyTitle = "";

        Generator generator = new Generator(emptyTitle, validIconNumber);

        Set<ConstraintViolation<Generator>> violations = validator.validate(generator);
        assertEquals(violations.size(), 1);
        ConstraintViolation<Generator> violation = violations.iterator().next();
        assertEquals("Title is required", violations.iterator().next().getMessage());
        assertEquals("title", violation.getPropertyPath().toString());
        assertEquals(emptyTitle, violation.getInvalidValue());
    }

    @Test
    void givenNegativeIconNumber_whenCreatingGenerator_thenExceptionIsThrown() {
        int negativeIconNumber = -1;

        Generator generator = new Generator(validTitle, negativeIconNumber);

        Set<ConstraintViolation<Generator>> violations = validator.validate(generator);
        assertEquals(violations.size(), 1);
        ConstraintViolation<Generator> violation = violations.iterator().next();
        assertEquals("Icon number must be a positive number", violations.iterator().next().getMessage());
        assertEquals("iconNumber", violation.getPropertyPath().toString());
        assertEquals(negativeIconNumber, violation.getInvalidValue());
    }
}
