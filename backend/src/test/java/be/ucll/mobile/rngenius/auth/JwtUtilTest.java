package be.ucll.mobile.rngenius.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import be.ucll.mobile.rngenius.auth.jwt.JwtUtil;
import be.ucll.mobile.rngenius.user.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = JwtUtil.class)
public class JwtUtilTest {

  @Autowired private JwtUtil jwtUtil;

  @Test
  void givenExistingUser_whenCreatingToken_thenTokenIsReturned() throws Exception {
    // given
    User user = new User("John", "Doe", "john.doe@ucll.be", "John123!");

    // when
    String token = jwtUtil.createToken(user);

    // then
    assertNotNull(token);
  }

  @Test
  void givenExistingToken_whenParsingClaims_thenClaimsAreReturned() throws Exception {
    // given
    User user = new User("John", "Doe", "john.doe@ucll.be", "John123!");
    user.id = ((long) 1);

    String token = jwtUtil.createToken(user);
    // when
    Claims parsedClaims = jwtUtil.parseJwtClaims(token);

    // then
    assertNotNull(parsedClaims);
    assertEquals(user.getEmail(), parsedClaims.getSubject());
    assertEquals(user.id, ((Integer) parsedClaims.get("id")).longValue());
  }

  @Test
  void givenHttpServletRequestWithValidToken_whenResolvingToken_thenReturnToken() {
    // given
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getHeader("Authorization"))
        .thenReturn(
            "Bearer"
                + " eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlkIjoxLCJyb2xlIjoiQURNSU4iLCJpc3N1ZXIiOiJjYXJfcmVudF9hcHAiLCJleHAiOjE3MTA4NjcyNjd9.161NfLOXPK5AgSgQyZVXQvou5VIZi-KWv9yv8cLqYoQ");

    // when
    String resolvedToken = jwtUtil.resolveToken(request);

    // then
    assertEquals(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlkIjoxLCJyb2xlIjoiQURNSU4iLCJpc3N1ZXIiOiJjYXJfcmVudF9hcHAiLCJleHAiOjE3MTA4NjcyNjd9.161NfLOXPK5AgSgQyZVXQvou5VIZi-KWv9yv8cLqYoQ",
        resolvedToken);
  }

  @Test
  void givenHttpServletRequestWithValidToken_whenResolvingClaims_thenReturnClaims()
      throws Exception {
    // given
    User user = new User("John", "Doe", "john.doe@ucll.be", "John123!");
    user.id = ((long) 1);
    String token = jwtUtil.createToken(user);
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getHeader("Authorization")).thenReturn("Bearer " + token);

    // when
    Claims resolvedClaims = jwtUtil.resolveClaims(request);

    // then
    assertNotNull(resolvedClaims);
    assertEquals(user.getEmail(), resolvedClaims.getSubject());
    assertEquals(user.id, ((Integer) resolvedClaims.get("id")).longValue());
  }

  @Test
  void givenHttpServletRequestWithInvalidTokenWithoutBearer_whenResolvingClaims_thenReturnClaims()
      throws Exception {
    // given
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getHeader("Authorization")).thenReturn("invalid");

    // when
    Claims resolvedClaims = jwtUtil.resolveClaims(request);

    // then
    assertNull(resolvedClaims);
  }

  @Test
  void givenHttpServletRequestWithInvalidTokenWithBearer_whenResolvingClaims_thenReturnClaims()
      throws Exception {
    // given
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getHeader("Authorization")).thenReturn("Bearer invalid");

    // when
    // then
    Assertions.assertThrows(Exception.class, () -> jwtUtil.resolveClaims(request));
  }

  @Test
  void givenHttpServletRequestWithExpiredToken_whenResolvingClaims_thenThrowExpiredJwtException()
      throws Exception {
    // given
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getHeader("Authorization"))
        .thenReturn(
            "Bearer"
                + " eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlkIjoxLCJyb2xlIjoiQURNSU4iLCJpc3N1ZXIiOiJjYXJfcmVudF9hcHAiLCJleHAiOjE3MTA4NjcyNjd9.161NfLOXPK5AgSgQyZVXQvou5VIZi-KWv9yv8cLqYoQ");

    // when
    // then
    Assertions.assertThrows(ExpiredJwtException.class, () -> jwtUtil.resolveClaims(request));
  }

  @Test
  void givenClaimsNotExpired_whenValidatingClaims_thenReturnTrue() throws Exception {
    // given
    User user = new User("John", "Doe", "john.doe@ucll.be", "John123!");
    user.id = ((long) 1);
    String token = jwtUtil.createToken(user);
    Claims claims = jwtUtil.parseJwtClaims(token);

    // when
    boolean isValid = jwtUtil.validateClaims(claims);

    // then
    assertNotNull(isValid);
    assertEquals(true, isValid);
  }

  @Test
  void givenClaimsExpired_whenValidatingClaims_thenReturnFalse() throws Exception {
    // given
    User user = new User("John", "Doe", "john.doe@ucll.be", "John123!");
    user.id = ((long) 1);
    String token = jwtUtil.createToken(user);
    Claims claims = jwtUtil.parseJwtClaims(token);
    claims.setExpiration(new Date(System.currentTimeMillis() - 1000));

    // when
    boolean isValid = jwtUtil.validateClaims(claims);

    // then
    assertNotNull(isValid);
    assertEquals(false, isValid);
  }

  @Test
  void givenExistingToken_whenRetrievingRequesterId_thenIdIsReturned() throws Exception {
    // given
    User user = new User("John", "Doe", "john.doe@ucll.be", "John123!");
    user.id = ((long) 1);

    String token = "Bearer: " + jwtUtil.createToken(user);

    // when
    long id = jwtUtil.retrieveRequesterId(token);

    // then
    assertNotNull(id);
    assertEquals(user.id, (long) id);
  }
}
