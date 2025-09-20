import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        console.log('AuthGuard running, x-auth:', request.headers['x-auth']);
        if (request.headers['x-auth'] !== 'secret') {
            throw new UnauthorizedException('Missing or invalid x-auth header');
        }
        return true;
    }
}