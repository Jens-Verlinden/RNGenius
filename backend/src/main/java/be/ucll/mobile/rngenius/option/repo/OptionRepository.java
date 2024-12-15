package be.ucll.mobile.rngenius.option.repo;

import be.ucll.mobile.rngenius.option.model.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {

  Option findOptionById(Long id);
}
