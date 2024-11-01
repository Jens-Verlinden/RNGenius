package be.ucll.mobile.rngenius.generator.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import be.ucll.mobile.rngenius.generator.model.Generator;

@Repository
public interface GeneratorRepository extends JpaRepository<Generator, Long> {

    Generator findGeneratorById(long id);

    List<Generator> findGeneratorsByUserId(Long userId);

}