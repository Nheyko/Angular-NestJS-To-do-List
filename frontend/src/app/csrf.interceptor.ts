import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfToken = document.cookie.match('(^|;)\\s*XSRF-TOKEN\\s*=\\s*([^;]+)')?.pop() || '';
        const csrfHeader = new HttpHeaders().set('X-XSRF-TOKEN', csrfToken);
        const csrfReq = req.clone({ headers: req.headers.set('X-XSRF-TOKEN', csrfToken) });
        return next(csrfReq);
};
