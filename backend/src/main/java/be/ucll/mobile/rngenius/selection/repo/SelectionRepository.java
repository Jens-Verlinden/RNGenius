package be.ucll.mobile.rngenius.selection.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import be.ucll.mobile.rngenius.selection.model.Selection;

@Repository
public interface SelectionRepository extends JpaRepository<Selection, Long> { 

    Selection findSelectionById(Long id);
    
    Selection findSelectionByParticipantIdAndOptionId(Long participantId, Long optionId);

    List<Selection> findSelectionsByOptionId(Long optionId);
}