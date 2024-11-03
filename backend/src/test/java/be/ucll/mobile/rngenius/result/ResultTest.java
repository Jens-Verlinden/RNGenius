package be.ucll.mobile.rngenius.result;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import be.ucll.mobile.rngenius.result.model.Result;
import be.ucll.mobile.rngenius.selection.model.Selection;

public class ResultTest {

    Result result;
    Selection selection;

    @BeforeEach
    public void setUp() {
        result = new Result();
        selection = new Selection();
        result.setSelection(selection);
    }

    @Test
    void givenValidValues_whenCreatingResult_thenResultIsCreated() {
        assertNotNull(result);
        assertNotNull(result.getDateTime());
        assertEquals(selection, result.getSelection());
    }

    @Test
    void givenNewValues_whenSettingResultProperties_thenPropertiesAreUpdated() {
        LocalDateTime newDateTime = LocalDateTime.now().plusDays(1);
        Selection newSelection = new Selection();
        result.setDateTime(newDateTime);
        result.setSelection(newSelection);

        assertEquals(newDateTime, result.getDateTime());
        assertEquals(newSelection, result.getSelection());
    }
}
