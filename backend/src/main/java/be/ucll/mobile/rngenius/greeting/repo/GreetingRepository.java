package be.ucll.mobile.rngenius.greeting.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import be.ucll.mobile.rngenius.greeting.model.Greeting;

@Repository
public interface GreetingRepository extends JpaRepository<Greeting, Long> {
    public Greeting findGreetingById(long id);
}
