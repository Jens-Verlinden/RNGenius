package be.ucll.mobile.rngenius.greeting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import be.ucll.mobile.rngenius.greeting.model.Greeting;
import be.ucll.mobile.rngenius.greeting.repo.GreetingRepository;
import be.ucll.mobile.rngenius.greeting.service.GreetingService;
import be.ucll.mobile.rngenius.greeting.service.GreetingServiceException;

@ExtendWith(MockitoExtension.class)
public class GreetingServiceTest {

    @Mock
    GreetingRepository greetingRepository;

    @InjectMocks
    GreetingService greetingService;

    private Greeting welcomeGreeting;

    @BeforeEach
    public void setUp() {
        welcomeGreeting = new Greeting("Hello world!");
    }

    private List<Greeting> getGreetings() {
        List<Greeting> list = new ArrayList<>();
        list.add(welcomeGreeting);
        return list;
    }

    @Test
    void givenGreetingInDb_whenGetGreeting_thenReturnGreeting() throws Exception {
        // given
        when(greetingRepository.findGreetingById(1)).thenReturn(getGreetings().get(0));

        // when
        Greeting greeting = greetingService.getGreeting();

        // then
        assertNotNull(greeting);
        assertEquals(welcomeGreeting, greeting);
    }

    @Test
    void givenNoGreetingInDb_whenGetGreeting_thenErrorIsThrown() throws Exception {
        // given
        when(greetingRepository.findGreetingById(1)).thenReturn(null);

        // when
        GreetingServiceException ex = Assertions.assertThrows(GreetingServiceException.class, () -> greetingService.getGreeting());
        
        // then
        assertEquals("greeting", ex.getField());
        assertEquals("No greeting found!", ex.getMessage());
    }
}