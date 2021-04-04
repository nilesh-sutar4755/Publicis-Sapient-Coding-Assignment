import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Injectable({
    providedIn: 'root'
})
export class HttpCustomInterceptor implements HttpInterceptor {
    constructor(private ngxService: NgxUiLoaderService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        this.ngxService.start();
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errMsg;
                    // Client Side Error
                    if (error.error instanceof ErrorEvent) {
                        errMsg = `Error: ${error.error.message}`;
                    }
                    else {
                        // Server Side Error
                    }
                    if (error) {
                        alert("An error occured, please try again later...")
                    }
                    return throwError(error);
                }),
                finalize(() => this.ngxService.stop())
            )
    }
}