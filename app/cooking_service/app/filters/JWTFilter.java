package filters;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.function.Function;
import javax.inject.Inject;

import akka.stream.Materializer;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import models.Identity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.api.routing.Router;
import play.libs.F;
import play.libs.typedmap.TypedKey;
import play.mvc.*;

import static play.mvc.Results.forbidden;

class Attrs {
    static final TypedKey<Identity> USER = TypedKey.create("user");
}

public class JWTFilter extends Filter {

    private static final String HEADER_AUTHORIZATION = "Authorization";
    private static final String BEARER = "Bearer ";
    private static final String ERR_AUTHORIZATION_HEADER = "ERR_AUTHORIZATION_HEADER";

    private static final Logger log = LoggerFactory.getLogger(JWTFilter.class);
    @Inject
    JWTValidator validator;

    @Inject
    public JWTFilter(Materializer mat) {
        super(mat);
    }

    @Override
    public CompletionStage<Result> apply(
            Function<Http.RequestHeader, CompletionStage<Result>> nextFilter,
            Http.RequestHeader requestHeader) {

        Optional<String> authHeader = requestHeader.getHeaders().get(HEADER_AUTHORIZATION);

        if (authHeader.filter(ah -> ah.contains(BEARER)).isEmpty()) {
            return CompletableFuture.completedFuture(forbidden(ERR_AUTHORIZATION_HEADER));
        }

        String token = authHeader.map(ah -> ah.replace(BEARER, "")).orElse("");
        try {
            var user = validator.getIdentityJwt(token);
            return nextFilter.apply(requestHeader.withAttrs(requestHeader.attrs().put(Attrs.USER, user)));
        } catch (JwtException e) {
            return CompletableFuture.completedFuture(forbidden());
        }
    }
}