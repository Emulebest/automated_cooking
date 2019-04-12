package filters;

import com.typesafe.config.Config;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import models.Identity;

import javax.inject.Inject;

public class JWTValidator {

    private final String secret;

    @Inject
    public JWTValidator(Config config) {
        this.secret = config.getString("play.http.secret.key");
    }

    Identity getIdentityJwt(String jws) throws JwtException {

        Claims payload = Jwts.parser().setSigningKey(secret).parseClaimsJws(jws).getBody();
        String username = payload.get("username", String.class);
        String email = payload.get("email", String.class);
        Long id = payload.get("id", Long.class);
        return new Identity(username, email, id);

    }
}
