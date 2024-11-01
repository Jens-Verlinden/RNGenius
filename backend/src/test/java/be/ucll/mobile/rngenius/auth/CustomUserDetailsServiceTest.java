package be.ucll.mobile.rngenius.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import be.ucll.mobile.rngenius.auth.service.CustomUserDetailsService;
import be.ucll.mobile.rngenius.user.model.User;
import be.ucll.mobile.rngenius.user.repo.UserRepository;

@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    CustomUserDetailsService customUserDetailsService;

    @Test
    void givenEmailOfExistingUser_whenGettingUserDetails_thenUserDetailsAreReturned() throws Exception {
        // given
        when(userRepository.findUserByEmail("john.doe@ucll.be")).thenReturn(
                new User("john", "doe", "john.doe@ucll.be", "John123!"));

        // when
        UserDetails userDetails = customUserDetailsService.loadUserByUsername("john.doe@ucll.be");

        // then
        assertNotNull(userDetails);
        assertEquals("john.doe@ucll.be", userDetails.getUsername());
        assertEquals("John123!", userDetails.getPassword());
    }
}
