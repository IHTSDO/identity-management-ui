import {HttpInterceptorFn} from '@angular/common/http';

export const AuthenticationInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req);
};
