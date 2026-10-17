import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { catchError, filter, Observable, tap, throwError } from "rxjs";

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    filter((event) => event.type === HttpEventType.Response),
    catchError((error) => {
      console.error('Request failed with error:', error);
      return throwError(() => error);
    }),
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    }),
  );
}