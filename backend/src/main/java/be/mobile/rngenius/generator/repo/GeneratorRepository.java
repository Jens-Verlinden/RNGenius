package be.mobile.rngenius.generator.repo;

import be.mobile.rngenius.generator.model.Generator;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneratorRepository extends JpaRepository<Generator, Long> {

  Generator findGeneratorById(Long id);

  List<Generator> findGeneratorsByUserId(Long userId);
}
