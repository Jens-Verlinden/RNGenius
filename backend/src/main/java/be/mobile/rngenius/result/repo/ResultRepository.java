package be.mobile.rngenius.result.repo;

import be.mobile.rngenius.result.model.Result;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

  List<Result> findResultsByGeneratorId(Long generatorId);
}
