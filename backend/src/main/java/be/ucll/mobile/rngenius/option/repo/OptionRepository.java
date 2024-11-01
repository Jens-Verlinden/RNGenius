package be.ucll.mobile.rngenius.option.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import be.ucll.mobile.rngenius.option.model.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {

    Option findOptionById(Long id);
}