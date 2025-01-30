package be.mobile.rngenius.selection;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import be.mobile.rngenius.option.model.Option;
import be.mobile.rngenius.participant.model.Participant;
import be.mobile.rngenius.selection.model.Selection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SelectionTest {

  Participant participant;
  Option option;
  Selection selection;

  @BeforeEach
  public void setUp() {
    participant = new Participant();
    option = new Option();
    selection = new Selection();
    selection.setParticipant(participant);
    selection.setOption(option);
    selection.setFavorised(true);
    selection.setExcluded(false);
  }

  @Test
  void givenValidValues_whenCreatingSelection_thenSelectionIsCreated() {
    assertNotNull(selection);
    assertEquals(participant, selection.getParticipant());
    assertEquals(option, selection.getOption());
    assertEquals(true, selection.getFavorised());
    assertEquals(false, selection.getExcluded());
  }

  @Test
  void givenNewValues_whenSettingSelectionProperties_thenPropertiesAreUpdated() {
    Participant newParticipant = new Participant();
    Option newOption = new Option();
    selection.setParticipant(newParticipant);
    selection.setOption(newOption);
    selection.setFavorised(false);
    selection.setExcluded(true);

    assertEquals(newParticipant, selection.getParticipant());
    assertEquals(newOption, selection.getOption());
    assertEquals(false, selection.getFavorised());
    assertEquals(true, selection.getExcluded());
  }
}
