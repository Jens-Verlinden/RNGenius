package be.ucll.mobile.rngenius.user.repo;

import be.ucll.mobile.rngenius.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  User findUserById(Long id);

  User findUserByEmailIgnoreCase(String email);
}
