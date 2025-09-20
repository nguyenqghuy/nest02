import { Observable, tap } from 'rxjs';
import {
Injectable,
NestInterceptor,
ExecutionContext,
CallHandler,
} from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    return next.handle().pipe(
        tap(() => {
            const delay = Date.now() - now;
            console.log(`Interceptor [${method}] ${url} - Request took ${delay}ms`);
        }),
    );
}
}