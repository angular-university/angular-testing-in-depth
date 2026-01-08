import {
    Injectable,
    Type,
    ApplicationRef,
    createComponent,
    EnvironmentInjector,
    Injector,
    inject
} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private appRef: ApplicationRef = inject(ApplicationRef);
    private envInjector: EnvironmentInjector = inject(EnvironmentInjector);
    constructor() { }

    open<T>(component: Type<T>, data: any) {
        const afterClosedSubject = new Subject<any>();

        const dialogInjector = Injector.create({
            providers: [
                { provide: 'DIALOG_DATA', useValue: data },
                {
                    provide: 'DIALOG_REF',
                    useValue: {
                        close: (result: any) => {
                            afterClosedSubject.next(result);
                            afterClosedSubject.complete();
                            newComponentRef.destroy();
                        }
                    }
                }
            ],
            parent: this.envInjector 
        });

        const newComponentRef = createComponent(component, {
            environmentInjector: this.envInjector,
            elementInjector: dialogInjector 
        });

        document.body.appendChild(newComponentRef.location.nativeElement);
        this.appRef.attachView(newComponentRef.hostView);

        return {
            afterClosed: () => afterClosedSubject.asObservable()
        };
    }
}