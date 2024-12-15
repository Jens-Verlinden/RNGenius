package be.ucll.mobile.rngenius.participant.repo;

import be.ucll.mobile.rngenius.participant.model.Participant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {

  Participant findParticipantByUserIdAndGeneratorId(Long userId, Long generatorId);

  List<Participant> findParticipantsByUserId(Long userId);
}
