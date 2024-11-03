package be.ucll.mobile.rngenius.result.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import be.ucll.mobile.rngenius.result.model.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    @Query("SELECT r FROM results r WHERE r.selection.participant.generator.id = :generatorId")
    List<Result> findResultsByGeneratorId(Long generatorId);
}
