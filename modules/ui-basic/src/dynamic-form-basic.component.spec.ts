import { TestBed, async, inject, ComponentFixture } from "@angular/core/testing";
import { Type, DebugElement } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { By } from "@angular/platform-browser";
import {
    DynamicFormsCoreModule,
    DynamicFormService,
    DynamicInputModel,
    DynamicFormControlModel,
    CoreFormControlType
} from "@ng2-dynamic-forms/core";
import { DynamicFormBasicComponent } from "./dynamic-form-basic.component";

describe("DynamicFormBasicComponent test suite", () => {

    let inputModel = new DynamicInputModel({id: "test"}),
        formModel = [inputModel],
        formGroup: FormGroup,
        fixture: ComponentFixture<DynamicFormBasicComponent>,
        component: DynamicFormBasicComponent,
        debugElement: DebugElement,
        inputElement: DebugElement;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [ReactiveFormsModule, DynamicFormsCoreModule.forRoot()],
            declarations: [DynamicFormBasicComponent]

        }).compileComponents().then(() => {

            fixture = TestBed.createComponent(DynamicFormBasicComponent as Type<DynamicFormBasicComponent>);

            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
        });
    }));

    beforeEach(inject([DynamicFormService], (service: DynamicFormService) => {

        formGroup = service.createFormGroup(formModel);

        component.group = formGroup;
        component.model = formModel[0];

        fixture.detectChanges();

        inputElement = debugElement.query(By.css(`input[id='${formModel[0].id}']`));
    }));

    it("should initialize correctly", () => {

        expect(component.control instanceof FormControl).toBe(true);
        expect(component.group instanceof FormGroup).toBe(true);
        expect(component.model instanceof DynamicFormControlModel).toBe(true);
        expect(component.hasErrorMessaging).toBe(false);

        expect(component.onControlValueChanges).toBeDefined();
        expect(component.onModelDisabledUpdates).toBeDefined();
        expect(component.onModelValueUpdates).toBeDefined();

        expect(component.blur).toBeDefined();
        expect(component.change).toBeDefined();
        expect(component.focus).toBeDefined();

        expect(component.onValueChange).toBeDefined();
        expect(component.onFocusChange).toBeDefined();

        expect(component.isValid).toBe(true);
        expect(component.isInvalid).toBe(false);
        expect(component.showErrorMessages).toBe(false);

        expect(component.type).toBe(CoreFormControlType.Input);
    });

    it("should have an input element", () => {

        expect(inputElement instanceof DebugElement).toBe(true);
    });

    it("should listen to native focus and blur events", () => {

        spyOn(component, "onFocusChange");

        inputElement.triggerEventHandler("focus", null);
        inputElement.triggerEventHandler("blur", null);

        expect(component.onFocusChange).toHaveBeenCalledTimes(2);
    });

    it("should listen to native change event", () => {

        spyOn(component, "onValueChange");

        inputElement.triggerEventHandler("change", null);

        expect(component.onValueChange).toHaveBeenCalled();
    });

    it("should update model value when control value changes", () => {

        spyOn(component, "onControlValueChanges");

        component.ngOnInit();

        component.control.setValue("test");

        expect(component.onControlValueChanges).toHaveBeenCalled();
    });

    it("should update control value when model value changes", () => {

        spyOn(component, "onModelValueUpdates");

        component.ngOnInit();

        inputModel.valueUpdates.next("test");

        expect(component.onModelValueUpdates).toHaveBeenCalled();
    });

    it("should update control activation when model disabled property changes", () => {

        spyOn(component, "onModelDisabledUpdates");

        component.ngOnInit();

        inputModel.disabledUpdates.next(true);

        expect(component.onModelDisabledUpdates).toHaveBeenCalled();
    });
});