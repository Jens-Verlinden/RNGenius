package be.ucll.mobile.rngenius.generator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import be.ucll.mobile.rngenius.generator.model.Generator;
import be.ucll.mobile.rngenius.generator.repo.GeneratorRepository;
import be.ucll.mobile.rngenius.generator.service.GeneratorService;
import be.ucll.mobile.rngenius.generator.service.GeneratorServiceException;
import be.ucll.mobile.rngenius.generator.service.GeneratorServiceAuthorizationException;
import be.ucll.mobile.rngenius.option.model.Option;
import be.ucll.mobile.rngenius.option.repo.OptionRepository;
import be.ucll.mobile.rngenius.user.model.User;
import be.ucll.mobile.rngenius.user.service.UserService;

@ExtendWith(MockitoExtension.class)
public class GeneratorServiceTest {

    @Mock
    private GeneratorRepository generatorRepository;

    @Mock
    private OptionRepository optionRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private GeneratorService generatorService;

    private Generator generator;
    private User user;

    @BeforeEach
    public void setUp() throws Exception {
        user = new User("John", "Doe", "john.doe@ucll.be", "JohnD123!");
        user.id = (1L);
        generator = new Generator();
        generator.id = (1L);
        generator.setUser(user);
    }

    @Test
    void givenValidIdAndRequesterId_whenGettingGeneratorById_thenGeneratorReturned() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        Generator foundGenerator = generatorService.getGeneratorById(generator.id, user.id);

        // then
        assertNotNull(foundGenerator);
        assertEquals(generator.id, foundGenerator.id);
    }

    @Test
    void givenInvalidId_whenGettingGeneratorById_thenGeneratorServiceExceptionIsThrown() {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(null);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.getGeneratorById(generator.id, user.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("No generator with this id", ex.getMessage());
    }

    @Test
    void givenUnauthorizedRequesterId_whenGettingGeneratorById_thenGeneratorServiceAuthorizationExceptionIsThrown() {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceAuthorizationException ex = assertThrows(GeneratorServiceAuthorizationException.class, () -> generatorService.getGeneratorById(generator.id, 2L));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("You are not authorized to retrieve this generator", ex.getMessage());
    }

    @Test
    void givenValidRequesterId_whenGettingMyGenerators_thenGeneratorsReturned() {
        // given
        List<Generator> generators = new ArrayList<>();
        generators.add(generator);
        when(generatorRepository.findGeneratorsByUserId(user.id)).thenReturn(generators);

        // when
        List<Generator> foundGenerators = generatorService.getMyGenerators(user.id);

        // then
        assertNotNull(foundGenerators);
        assertEquals(1, foundGenerators.size());
    }

    @Test
    void givenValidGeneratorAndRequesterId_whenAddingGenerator_thenGeneratorAdded() throws Exception {
        // given
        when(userService.getUserById(user.id)).thenReturn(user);
        when(generatorRepository.save(generator)).thenReturn(generator);

        // when
        generatorService.addGenerator(generator, user.id);

        // then
        verify(generatorRepository, times(1)).save(generator);
    }

    @Test
    void givenNullGenerator_whenAddingGenerator_thenGeneratorServiceExceptionIsThrown() {
        // given
        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.addGenerator(null, user.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("Generator data is required", ex.getMessage());
    }

    @Test
    void givenValidIdAndRequesterId_whenDeletingGeneratorById_thenGeneratorDeleted() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        generatorService.deleteGeneratorById(generator.id, user.id);

        // then
        verify(generatorRepository, times(1)).delete(generator);
    }

    @Test
    void givenValidGeneratorIdOptionAndRequesterId_whenAddingGeneratorOption_thenOptionAdded() throws Exception {
        // given
        Option option = new Option();
        option.id = (1L);
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(optionRepository.save(option)).thenReturn(option);

        // when
        generatorService.addGeneratorOption(generator.id, option, user.id);

        // then
        verify(optionRepository, times(1)).save(option);
    }

    @Test
    void givenNullOption_whenAddingGeneratorOption_thenGeneratorServiceExceptionIsThrown() {
        // given
        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.addGeneratorOption(generator.id, null, user.id));

        // then
        assertEquals("option", ex.getField());
        assertEquals("Option data is required", ex.getMessage());
    }

    @Test
    void givenValidOptionIdCategoryAndRequesterId_whenDeletingCategorizedGeneratorOption_thenOptionDeleted() throws Exception {
        // given
        Option option = new Option();
        option.id = (1L);
        option.setGenerator(generator);
        option.setCategories(new ArrayList<>(List.of("category")));
        when(optionRepository.findOptionById(option.id)).thenReturn(option);

        // when
        generatorService.deleteCategorizedGeneratorOption(option.id, "category", user.id);

        // then
        verify(optionRepository, times(1)).delete(option);
    }

    @Test
    void givenValidGeneratorIdAndRequesterId_whenGeneratingOption_thenOptionReturned() throws Exception {
        // given
        Option option = new Option();
        option.id = (1L);
        List<Option> options = new ArrayList<>();
        options.add(option);
        generator.setOptions(options);
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        Option generatedOption = generatorService.generateOption(generator.id, user.id);

        // then
        assertNotNull(generatedOption);
        assertEquals(option.id, generatedOption.id);
    }

    @Test
    void givenNoOptions_whenGeneratingOption_thenGeneratorServiceExceptionIsThrown() {
        // given
        generator.setOptions(new ArrayList<>());
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.generateOption(generator.id, user.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("No options available", ex.getMessage());
    }
}
