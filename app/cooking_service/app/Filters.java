import filters.JWTFilter;
import play.http.DefaultHttpFilters;
import javax.inject.Inject;

public class Filters extends DefaultHttpFilters {
    @Inject
    public Filters(JWTFilter filter) {
        super(filter);
    }
}