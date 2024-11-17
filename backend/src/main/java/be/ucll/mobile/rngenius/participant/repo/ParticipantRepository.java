package be.ucll.mobile.rngenius.participant.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import be.ucll.mobile.rngenius.participant.model.Participant;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    
    Participant findParticipantByUserIdAndGeneratorId(Long userId, Long generatorId);
}