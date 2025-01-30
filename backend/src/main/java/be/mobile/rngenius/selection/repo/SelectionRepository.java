package be.mobile.rngenius.selection.repo;

import be.mobile.rngenius.selection.model.Selection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SelectionRepository extends JpaRepository<Selection, Long> {

  Selection findSelectionById(Long id);

  Selection findSelectionByParticipantIdAndOptionId(Long participantId, Long optionId);

  List<Selection> findSelectionsByOptionId(Long optionId);

  @Query("SELECT s FROM selections s WHERE s.participant.user.id = ?1 AND s.option.id = ?2")
  Selection findSelectionByParticipantUserIdAndOptionId(Long userId, Long optionID);
}
