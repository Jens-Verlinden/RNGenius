package be.ucll.mobile.rngenius.generator;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

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
import be.ucll.mobile.rngenius.participant.model.Participant;
import be.ucll.mobile.rngenius.participant.repo.ParticipantRepository;
import be.ucll.mobile.rngenius.result.model.Result;
import be.ucll.mobile.rngenius.result.repo.ResultRepository;
import be.ucll.mobile.rngenius.selection.model.Selection;
import be.ucll.mobile.rngenius.selection.repo.SelectionRepository;
import be.ucll.mobile.rngenius.user.model.User;
import be.ucll.mobile.rngenius.user.service.UserService;

@ExtendWith(MockitoExtension.class)
public class GeneratorServiceTest {

    @Mock
    private GeneratorRepository generatorRepository;

    @Mock
    private OptionRepository optionRepository;

    @Mock
    private ParticipantRepository participantRepository;

    @Mock
    private SelectionRepository selectionRepository;

    @Mock
    private ResultRepository resultRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private GeneratorService generatorService;

    private Generator generator;
    private User user1;
    private User user2;
    private Option option1;
    private Option option2;
    private Participant participant1;
    private Participant participant2;
    private Selection selection1;
    private Selection selection2;

    @BeforeEach
    public void setUp() throws Exception {
        user1 = new User("John", "Doe", "john.doe@ucll.be", "JohnD123!");
        user1.id = 1L;
        user2 = new User("Jane", "Doe", "jane.doe@ucll.be", "JaneD123!");
        user2.id = 2L;
        generator = new Generator();
        generator.id = 1L;
        generator.setUser(user1);
        option1 = new Option("Option 1", new ArrayList<>(List.of("Category1", "Category2")), "Description 1");
        option1.id = 1L;
        option1.setGenerator(generator);
        option2 = new Option("Option 2", new ArrayList<>(List.of("Category3", "Category4")), "Description 2");
        option2.id = 2L;
        option2.setGenerator(generator);
        generator.setOptions(List.of(option1, option2));
        participant1 = new Participant();
        participant1.setUser(user1);
        participant1.setGenerator(generator);
        participant2 = new Participant();
        participant2.setUser(user2);
        participant2.setGenerator(generator);
        generator.setParticipants(List.of(participant1, participant2));
        user1.setParticipants(List.of(participant1));
        user2.setParticipants(List.of(participant2));
        selection1 = new Selection();
        selection1.setParticipant(participant1);
        selection1.setOption(option1);
        selection2 = new Selection();
        selection2.setParticipant(participant2);
        selection2.setOption(option2);
        participant1.setSelections(List.of(selection1));
        participant2.setSelections(List.of(selection2));
        option1.setSelections(List.of(selection1));
        option2.setSelections(List.of(selection2));
    }

    @Test
    void givenValidIdAndRequesterId_whenGettingGeneratorById_thenGeneratorReturned() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        Generator foundGenerator = generatorService.getGeneratorById(generator.id, user1.id);

        // then
        assertNotNull(foundGenerator);
        assertEquals(generator.id, foundGenerator.id);
    }

    @Test
    void givenInvalidId_whenGettingGeneratorById_thenGeneratorServiceExceptionIsThrown() {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(null);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.getGeneratorById(generator.id, user1.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("No generator with this id", ex.getMessage());
    }

    @Test
    void givenUnauthorizedRequesterId_whenGettingGeneratorById_thenGeneratorServiceAuthorizationExceptionIsThrown() {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceAuthorizationException ex = assertThrows(GeneratorServiceAuthorizationException.class, () -> generatorService.getGeneratorById(generator.id, (long) -1));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("You are not authorized to view this generator", ex.getMessage());
    }

    @Test
    void givenValidRequesterId_whenGettingMyGenerators_thenGeneratorsReturned() {
        // given
        List<Generator> generators = new ArrayList<>();
        generators.add(generator);
        when(generatorRepository.findAll()).thenReturn(generators);

        // when
        List<Generator> foundGenerators = generatorService.getMyGenerators(user1.id);

        // then
        assertNotNull(foundGenerators);
        assertEquals(1, foundGenerators.size());
    }

    @Test
    void givenValidGeneratorAndRequesterId_whenAddingGenerator_thenGeneratorAdded() throws Exception {
        // given
        when(userService.getUserById(user1.id)).thenReturn(user1);
        when(generatorRepository.save(generator)).thenReturn(generator);

        // when
        generatorService.addGenerator(generator, user1.id);

        // then
        verify(generatorRepository, times(1)).save(generator);
        verify(participantRepository, times(1)).save(any(Participant.class));
    }

    @Test
    void givenNullGenerator_whenAddingGenerator_thenGeneratorServiceExceptionIsThrown() {
        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.addGenerator(null, user1.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("Generator data is required", ex.getMessage());
    }

    @Test
    void givenValidGeneratorAndRequesterId_whenUpdatingGenerator_thenGeneratorUpdated() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        generator.setTitle("New Title");
        generator.setIconNumber(2);
        generatorService.updateGenerator(generator.id, generator, user1.id);

        // then
        verify(generatorRepository, times(1)).save(generator);
    }

    @Test
    void givenUnauthorizedRequesterId_whenUpdatingGenerator_thenGeneratorServiceAuthorizationExceptionIsThrown() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceAuthorizationException ex = assertThrows(GeneratorServiceAuthorizationException.class, () -> generatorService.updateGenerator(generator.id, generator, user2.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("You are not authorized to update this generator", ex.getMessage());
    }

    @Test
    void givenValidIdAndRequesterId_whenDeletingGeneratorById_thenGeneratorDeleted() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        generatorService.deleteGeneratorById(generator.id, user1.id);

        // then
        verify(generatorRepository, times(1)).delete(generator);
    }

    @Test
    void givenUnauthorizedRequesterId_whenDeletingGeneratorById_thenGeneratorServiceAuthorizationExceptionIsThrown() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceAuthorizationException ex = assertThrows(GeneratorServiceAuthorizationException.class, () -> generatorService.deleteGeneratorById(generator.id, user2.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("You are not authorized to delete this generator", ex.getMessage());
    }

    @Test
    void givenValidGeneratorIdOptionAndRequesterId_whenAddingGeneratorOption_thenOptionAdded() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(optionRepository.save(option1)).thenReturn(option1);

        // when
        generatorService.addGeneratorOption(generator.id, option1, user1.id);

        // then
        verify(optionRepository, times(1)).save(option1);
    }

    @Test
    void givenValidGeneratorIdOptionAndRequesterIdAndOptionWithNameAlreadyExist_whenAddingGeneratorOption_thenOptionDescriotpionIsOverwrittenAndNewCategroiesAreAdded() throws Exception {
        // given
        Option oldOption = new Option();
        oldOption.id = (1L);
        oldOption.setName("cake");
        oldOption.setDescription("i love cake");
        oldOption.setCategories(new ArrayList<>(List.of("dessert")));

        generator.setOptions(new ArrayList<>(List.of(oldOption)));

        Option option = new Option();
        option.id = (2L);
        option.setName("cake");
        option.setDescription("i hate cake");
        option.setCategories(new ArrayList<>(List.of("food")));

        Option newOption = new Option();
        newOption.id = (1L);
        newOption.setName("cake");
        newOption.setDescription("i hate cake");
        newOption.setCategories(new ArrayList<>(List.of("dessert", "food")));

        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(optionRepository.save(oldOption)).thenReturn(newOption);

        // when
        generatorService.addGeneratorOption(generator.id, option, user1.id);

        // then
        verify(optionRepository, times(1)).save(oldOption);
        assertEquals("i hate cake", newOption.getDescription());
        assertEquals(2, newOption.getCategories().size());
        assertEquals("dessert", newOption.getCategories().get(0));
        assertEquals("food", newOption.getCategories().get(1));
    }

    @Test
    void givenNullOption_whenAddingGeneratorOption_thenGeneratorServiceExceptionIsThrown() {
        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.addGeneratorOption(generator.id, null, user1.id));

        // then
        assertEquals("option", ex.getField());
        assertEquals("Option data is required", ex.getMessage());
    }

    @Test
    void givenValidOptionIdCategoryAndRequesterId_whenDeletingCategorizedGeneratorOption_thenOptionDeleted() throws Exception {
        // given
        option1.setCategories(new ArrayList<>(List.of("category")));
        when(optionRepository.findOptionById(option1.id)).thenReturn(option1);

        // when
        generatorService.deleteCategorizedGeneratorOption(option1.id, "category", user1.id);

        // then
        verify(optionRepository, times(1)).delete(option1);
    }

    @Test
    void givenValidOptionIdCategoryAndRequesterId_whenDeletingCategorizedGeneratorOptionButStillCategoryRemaining_thenOptionCateryDeleted() throws Exception {
        // given
        option1.setCategories(new ArrayList<>(List.of("category1", "category2")));
        when(optionRepository.findOptionById(option1.id)).thenReturn(option1);

        // when
        generatorService.deleteCategorizedGeneratorOption(option1.id, "category1", user1.id);

        // then
        verify(optionRepository, times(0)).delete(option1);
        assertEquals(1, option1.getCategories().size());
        assertEquals("category2", option1.getCategories().get(0));
    }

    @Test 
    void givenUnauthorizedRequesterId_whenDeletingCategorizedGeneratorOption_thenGeneratorServiceAuthorizationExceptionIsThrown() throws Exception {
        // given
        option1.setCategories(List.of("category"));
        when(optionRepository.findOptionById(option1.id)).thenReturn(option1);

        // when
        GeneratorServiceAuthorizationException ex = assertThrows(GeneratorServiceAuthorizationException.class, () -> generatorService.deleteCategorizedGeneratorOption(option1.id, "category", user2.id));

        // then
        assertEquals("option", ex.getField());
        assertEquals("You are not authorized to delete this option", ex.getMessage());
    }

    @Test
    void givenValidGeneratorIdAndRequesterId_whenGeneratingOption_thenOptionReturned() throws Exception {
        // given
        selection2.setExcluded(true);
        selection1.setFavorised(true);
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(selectionRepository.findSelectionsByOptionId(option1.id)).thenReturn(List.of(selection1));
        when(selectionRepository.findSelectionsByOptionId(option2.id)).thenReturn(List.of(selection2));
        when(selectionRepository.findSelectionByParticipantUserIdAndOptionId(user1.id, option1.id)).thenReturn(selection1);
        when(resultRepository.save(any(Result.class))).thenReturn(new Result());

        // when
        Option generatedOption = generatorService.generateOption(generator.id, user1.id);

        // then
        assertNotNull(generatedOption);
        assertEquals(option1.id, generatedOption.id);
        verify(resultRepository, times(1)).save(any(Result.class));
    }

    @Test
    void givenNoOptions_whenGeneratingOption_thenGeneratorServiceExceptionIsThrown() {
        // given
        generator.setOptions(new ArrayList<>());
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.generateOption(generator.id, user1.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("No valid options available", ex.getMessage());
    }

    @Test
    void givenValidOptionIdAndRequesterId_whenPrioritisingOption_thenOptionPrioritised() throws Exception {
        // given
        when(selectionRepository.findSelectionByParticipantUserIdAndOptionId(user1.id, option1.id)).thenReturn(selection1);

        // when
        generatorService.favoriseOption(option1.id, user1.id);

        // then
        verify(selectionRepository, times(1)).save(selection1);
        assertTrue(selection1.getFavorised());
        assertFalse(selection1.getExcluded());
    }

    @Test
    void givenValidOptionIdAndRequesterId_whenExcludingOption_thenOptionExcluded() throws Exception {
        // given
        when(selectionRepository.findSelectionByParticipantUserIdAndOptionId(user1.id, option1.id)).thenReturn(selection1);

        // when
        generatorService.excludeOption(option1.id, user1.id);

        // then
        verify(selectionRepository, times(1)).save(selection1);
        assertFalse(selection1.getFavorised());
        assertTrue(selection1.getExcluded());
    }

    @Test
    void givenValidGeneratorIdEmailAndRequesterId_whenAddingGeneratorParticipant_thenParticipantAdded() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(userService.getUserByEmail(user2.getEmail())).thenReturn(user2);
        when(participantRepository.findParticipantByUserIdAndGeneratorId(user2.id, generator.id)).thenReturn(null);

        // when
        generatorService.addGeneratorParticipant(generator.id, user2.getEmail(), user1.id);

        // then
        verify(participantRepository, times(1)).save(any(Participant.class));
        verify(selectionRepository, times(2)).save(any(Selection.class));
    }

    @Test
    void givenExistingParticipant_whenAddingGeneratorParticipant_thenGeneratorServiceExceptionIsThrown() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(userService.getUserByEmail(user2.getEmail())).thenReturn(user2);
        when(participantRepository.findParticipantByUserIdAndGeneratorId(user2.id, generator.id)).thenReturn(participant2);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.addGeneratorParticipant(generator.id, user2.getEmail(), user1.id));

        // then
        assertEquals("participant", ex.getField());
        assertEquals("Participant already joined this generator", ex.getMessage());
    }

    @Test
    void givenUnauthorizedRequesterId_whenAddingGeneratorParticipant_thenGeneratorServiceAuthorizationExceptionIsThrown() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceAuthorizationException ex = assertThrows(GeneratorServiceAuthorizationException.class, () -> generatorService.addGeneratorParticipant(generator.id, user2.getEmail(), user2.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("You are not authorized to add participants to this generator", ex.getMessage());
    }

    @Test
    void givenValidGeneratorIdAndParticipantId_whenDeletingGeneratorParticipant_thenParticipantDeleted() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(participantRepository.findParticipantByUserIdAndGeneratorId(user2.id, generator.id)).thenReturn(participant2);

        // when
        generatorService.removeGeneratorParticipant(generator.id, user2.id, user1.id);

        // then
        verify(participantRepository, times(1)).delete(participant2);
    }

    @Test
    void givenNonExistentParticipant_whenDeletingGeneratorParticipant_thenGeneratorServiceExceptionIsThrown() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(participantRepository.findParticipantByUserIdAndGeneratorId(user2.id, generator.id)).thenReturn(null);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.removeGeneratorParticipant(generator.id, user2.id, user1.id));

        // then
        assertEquals("participant", ex.getField());
        assertEquals("Participant not found in this generator", ex.getMessage());
    }

    @Test
    void givenOwnerDeletingThemselves_whenDeletingGeneratorParticipant_thenGeneratorServiceAuthorizationExceptionIsThrown() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.removeGeneratorParticipant(generator.id, user1.id, user1.id));

        // then
        assertEquals("participant", ex.getField());
        assertEquals("You cannot remove yourself from your own generator", ex.getMessage());
    }

    @Test
    void givenUnauthorizedRequesterId_whenDeletingGeneratorParticipant_thenGeneratorServiceAuthorizationExceptionIsThrown() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceAuthorizationException ex = assertThrows(GeneratorServiceAuthorizationException.class, () -> generatorService.removeGeneratorParticipant(generator.id, user2.id, user2.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("You are not authorized to delete participants from this generator", ex.getMessage());
    }

    @Test
    void givenValidGeneratorIdAndRequesterId_whenLeavingGenerator_thenParticipantDeleted() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);
        when(participantRepository.findParticipantByUserIdAndGeneratorId(user2.id, generator.id)).thenReturn(participant2);

        // when
        generatorService.leaveGenerator(generator.id, user2.id);

        // then
        verify(participantRepository, times(1)).delete(participant2);
    }

    @Test
    void givenOwnerLeavingGenerator_whenLeavingGenerator_thenGeneratorServiceAuthorizationExceptionIsThrown() throws Exception {
        // given
        when(generatorRepository.findGeneratorById(generator.id)).thenReturn(generator);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.leaveGenerator(generator.id, user1.id));

        // then
        assertEquals("generator", ex.getField());
        assertEquals("You cannot leave your own generator", ex.getMessage());
    }

    
    @Test
    void givenValidGeneratorIdAndRequesterId_whenTogglingNotifications_thenNotificationsToggled() throws Exception {
        // given
        when(participantRepository.findParticipantByUserIdAndGeneratorId(user1.id, generator.id)).thenReturn(participant1);
        boolean initialNotificationStatus = participant1.getNotifications();

        // when
        generatorService.toggleNotifications(generator.id, user1.id);

        // then
        verify(participantRepository, times(1)).save(participant1);
        assertEquals(!initialNotificationStatus, participant1.getNotifications());
    }

    @Test
    void givenNonExistentParticipant_whenTogglingNotifications_thenGeneratorServiceExceptionIsThrown() {
        // given
        when(participantRepository.findParticipantByUserIdAndGeneratorId(user1.id, generator.id)).thenReturn(null);

        // when
        GeneratorServiceException ex = assertThrows(GeneratorServiceException.class, () -> generatorService.toggleNotifications(generator.id, user1.id));

        // then
        assertEquals("participant", ex.getField());
        assertEquals("Participant not found in this generator", ex.getMessage());
    }

    @Test
    void givenValidRequesterId_whenGettingMyNotifiedResults_thenResultsReturned() {
        // given
        participant1.setNotifications(true);
        Result result = new Result();
        result.setSelection(selection1);
        when(participantRepository.findParticipantsByUserId(user1.id)).thenReturn(List.of(participant1));
        when(resultRepository.findResultsByGeneratorId(generator.id)).thenReturn(List.of(result));

        // when
        List<Result> results = generatorService.getMyNotifiedResults(user1.id);

        // then
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(result, results.get(0));
    }

    @Test
    void givenValidRequesterId_whenGettingMyNotifiedResultsWithNoNotifications_thenEmptyResultsReturned() {
        // given
        participant1.setNotifications(false);
        when(participantRepository.findParticipantsByUserId(user1.id)).thenReturn(List.of(participant1));

        // when
        List<Result> results = generatorService.getMyNotifiedResults(user1.id);

        // then
        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    void givenValidOptionId_whenGettingOptionById_thenOptionReturned() throws Exception {
        // given
        when(optionRepository.findOptionById(option1.id)).thenReturn(option1);

        // when
        Method method = GeneratorService.class.getDeclaredMethod("getOptionById", Long.class);
        method.setAccessible(true);
        Option foundOption = (Option) method.invoke(generatorService, option1.id);

        // then
        assertNotNull(foundOption);
        assertEquals(option1.id, foundOption.id);
    }

    @Test
    void givenInvalidOptionId_whenGettingOptionById_thenGeneratorServiceExceptionIsThrown() throws Exception {
        // given
        when(optionRepository.findOptionById(option1.id)).thenReturn(null);

        // when
        Method method = GeneratorService.class.getDeclaredMethod("getOptionById", Long.class);
        method.setAccessible(true);

        InvocationTargetException ex = assertThrows(InvocationTargetException.class, () -> method.invoke(generatorService, option1.id));

        // then
        assertEquals(GeneratorServiceException.class, ex.getTargetException().getClass());
        assertEquals("option", ((GeneratorServiceException) ex.getTargetException()).getField());
        assertEquals("No option with this id", ex.getTargetException().getMessage());
    }

    @Test
    void givenValidParticipantIdAndOptionId_whenGettingSelectionByParticipantIdAndOptionId_thenSelectionReturned() throws Exception {
        // given
        when(selectionRepository.findSelectionByParticipantUserIdAndOptionId(user1.id, option1.id)).thenReturn(selection1);

        // when
        Method method = GeneratorService.class.getDeclaredMethod("getSelectionByParticipantUserIdAndOptionId", Long.class, Long.class);
        method.setAccessible(true);
        Selection foundSelection = (Selection) method.invoke(generatorService, user1.id, option1.id);

        // then
        assertNotNull(foundSelection);
        assertEquals(selection1.id, foundSelection.id);
    }

    @Test
    void givenInvalidParticipantIdAndOptionId_whenGettingSelectionByParticipantIdAndOptionId_thenGeneratorServiceExceptionIsThrown() throws Exception {
        // given
        when(selectionRepository.findSelectionByParticipantUserIdAndOptionId(user1.id, option1.id)).thenReturn(null);

        // when
        Method method = GeneratorService.class.getDeclaredMethod("getSelectionByParticipantUserIdAndOptionId", Long.class, Long.class);
        method.setAccessible(true);

        InvocationTargetException ex = assertThrows(InvocationTargetException.class, () -> method.invoke(generatorService, user1.id, option1.id));

        // then
        assertEquals(GeneratorServiceException.class, ex.getTargetException().getClass());
        assertEquals("selection", ((GeneratorServiceException) ex.getTargetException()).getField());
        assertEquals("No selection with this participant and option", ex.getTargetException().getMessage());
    }    
}