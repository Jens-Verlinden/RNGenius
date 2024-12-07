package be.ucll.mobile.rngenius.result;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import be.ucll.mobile.rngenius.option.model.Option;
import be.ucll.mobile.rngenius.result.model.Result;
import be.ucll.mobile.rngenius.user.model.User;

public class ResultTest {

    Result result;
    Option option;
    User user;

    @BeforeEach
    public void setUp() {
        result = new Result();
        option = new Option();
        user = new User();

        result.setOption(option);
        result.setUser(user);
        result.setGeneratorId(1L);
    }

    @Test
    void givenValidValues_whenCreatingResult_thenResultIsCreated() {
        assertNotNull(result);
        assertNotNull(result.getDateTime());
        assertEquals(result.getUser(), user);
        assertEquals(result.getOption(), option);
        assertEquals(result.getGeneratorId(), 1L);
    }

    @Test
    void givenNewValues_whenSettingResultProperties_thenPropertiesAreUpdated() {
        LocalDateTime newDateTime = LocalDateTime.now().plusDays(1);
        Option newOption = new Option();
        User newUser = new User();
        result.setDateTime(newDateTime);
        result.setOption(newOption);
        result.setUser(newUser);
        result.setGeneratorId(2L);

        assertEquals(newDateTime, result.getDateTime());
        assertEquals(newOption, result.getOption());
        assertEquals(newUser, result.getUser());
        assertEquals(2L, result.getGeneratorId());
    }
}
