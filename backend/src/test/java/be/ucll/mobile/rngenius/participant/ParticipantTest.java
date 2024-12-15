package be.ucll.mobile.rngenius.participant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import be.ucll.mobile.rngenius.generator.model.Generator;
import be.ucll.mobile.rngenius.participant.model.Participant;
import be.ucll.mobile.rngenius.selection.model.Selection;
import be.ucll.mobile.rngenius.user.model.User;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ParticipantTest {

  User user;
  Generator generator;
  List<Selection> selections;
  Participant participant;

  @BeforeEach
  public void setUp() {
    user = new User();
    generator = new Generator();
    selections = new ArrayList<>();
    participant = new Participant();
    participant.setUser(user);
    participant.setGenerator(generator);
    participant.setSelections(selections);
    participant.setNotifications(false);
  }

  @Test
  void givenValidValues_whenCreatingParticipant_thenParticipantIsCreated() {
    assertNotNull(participant);
    assertEquals(user, participant.getUser());
    assertEquals(generator, participant.getGenerator());
    assertEquals(selections, participant.getSelections());
    assertFalse(participant.getNotifications());
  }

  @Test
  void givenNewValues_whenSettingParticipantProperties_thenPropertiesAreUpdated() {
    User newUser = new User();
    Generator newGenerator = new Generator();
    List<Selection> newSelections = new ArrayList<>();
    participant.setUser(newUser);
    participant.setGenerator(newGenerator);
    participant.setSelections(newSelections);
    participant.setNotifications(true);

    assertEquals(newUser, participant.getUser());
    assertEquals(newGenerator, participant.getGenerator());
    assertEquals(newSelections, participant.getSelections());
    assertTrue(participant.getNotifications());
  }
}
