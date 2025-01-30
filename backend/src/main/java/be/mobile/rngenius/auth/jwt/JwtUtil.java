package be.mobile.rngenius.auth.jwt;

import be.mobile.rngenius.user.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.DefaultClaims;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

  private final String secret_key = Secret.getSecret();

  private long accessTokenValidityInMinutes = 60;

  private final JwtParser jwtParser;

  private final String TOKEN_HEADER = "Authorization";
  private final String TOKEN_PREFIX = "Bearer ";

  public JwtUtil() {
    this.jwtParser = Jwts.parser().setSigningKey(secret_key);
  }

  public String createToken(User user) {
    Claims claims = Jwts.claims().setSubject(user.getEmail());
    claims.put("id", user.id);
    claims.put("issuer", "rngenius_backend");
    Date tokenCreateTime = new Date();
    Date tokenValidity =
        new Date(
            tokenCreateTime.getTime() + TimeUnit.MINUTES.toMillis(accessTokenValidityInMinutes));
    return Jwts.builder()
        .setClaims(claims)
        .setHeaderParam("typ", "JWT")
        .setExpiration(tokenValidity)
        .signWith(SignatureAlgorithm.HS256, secret_key)
        .compact();
  }

  public Claims parseJwtClaims(String token) {
    return jwtParser.parseClaimsJws(token).getBody();
  }

  public String resolveToken(HttpServletRequest request) {

    String bearerToken = request.getHeader(TOKEN_HEADER);
    if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX)) {
      return bearerToken.substring(TOKEN_PREFIX.length());
    }
    return null;
  }

  public Claims resolveClaims(HttpServletRequest req) {
    try {
      String token = resolveToken(req);
      if (token != null) {
        return parseJwtClaims(token);
      }
      return null;
    } catch (ExpiredJwtException ex) {
      req.setAttribute("expired", ex.getMessage());
      throw ex;
    } catch (Exception ex) {
      req.setAttribute("invalid", ex.getMessage());
      throw ex;
    }
  }

  public boolean validateClaims(Claims claims) throws AuthenticationException {
    try {
      return claims.getExpiration().after(new Date());
    } catch (Exception e) {
      throw e;
    }
  }

  public long retrieveRequesterId(String authorizationHeader) {
    String token = authorizationHeader.substring(7);
    Claims claims;
    try {
      claims = jwtParser.parseClaimsJws(token).getBody();
    } catch (ExpiredJwtException ex) {
      claims = (DefaultClaims) ex.getClaims();
    }
    return (int) claims.get("id");
  }
}
