package be.mobile.rngenius.option.repo;

import be.mobile.rngenius.option.model.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {

  Option findOptionById(Long id);
}
