import { HttpContextToken, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // apply caching logic
    return next(req);
  } else {
    // caching has been disabled for this request
    return next(req);
  }
}

export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);