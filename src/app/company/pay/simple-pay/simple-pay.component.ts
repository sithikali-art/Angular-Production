import { Component, signal, input, viewChild } from '@angular/core';
import { StepperComponent } from '../../../shared/components/stepper/stepper.component';
import { RadioGroupComponent, RadioOption } from '../../../shared/components/radio-group/radio-group.component';
import { CheckboxGroupComponent, CheckboxOption } from '../../../shared/components/checkbox-group/checkbox-group.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { OtpInputComponent } from '../../../shared/components/otp-input/otp-input.component';
import { LimitsCardComponent } from '../../../shared/components/limits-card/limits-card.component';
import { TagPickerComponent, TagOption } from '../../../shared/components/tag-picker/tag-picker.component';
import { FileUploaderComponent } from '../../../shared/components/file-uploader/file-uploader.component';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FancySpinnerComponent } from '../../../shared/components/fancy-spinner/fancy-spinner.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

// 1. Explicitly type the alert state interface
export interface AlertState {
  show: boolean;
  type: AlertType;
  title: string;
  message: string;
}

@Component({
  selector: 'app-simple-pay',
  imports: [StepperComponent, RadioGroupComponent, CheckboxGroupComponent, TextareaComponent, 
            OtpInputComponent, LimitsCardComponent, TagPickerComponent, FileUploaderComponent, 
            DropdownComponent, AlertComponent, InputComponent, FancySpinnerComponent, SectionCardComponent, IconComponent],
  templateUrl: './simple-pay.component.html',
  styleUrl: './simple-pay.component.scss',
})
export class SimplePayComponent {
/** Track current active step signal */
  readonly currentStep = signal<number>(0);

  /** Triggered when Cancel button is clicked */
  closeDrawer(): void {
    console.log('Drawer closed');
    // Add your drawer toggle logic here
  }

  /** Triggered on the final step submission */
  onSavePermissions(): void {
    console.log('Permissions saved');
    // Add your submit/API logic here
  }

  /* Radio Group */
  selectedOption = signal<string>('select');

  tradeOptions: RadioOption[] = [
    { label: 'Please Select', value: 'select' },
    { label: 'No, the entity is not publicly traded', value: 'no' },
    { label: 'Yes, the entity is publicly traded', value: 'yes' }
  ];

  /* Checkbox Group */
  selectedFeatures = signal<string[]>(['trading']);

  features: CheckboxOption[] = [
    { label: 'Public Trading Access', value: 'trading' },
    { label: 'Regulatory Filings', value: 'filings' },
    { label: 'Institutional Ownership', value: 'ownership' }
  ];


  /* Textarea */
  infoText = signal<string>('');

  /* OTP Event Handlers */
  onVerifyOtp(code: string): void {
    console.log('Submitted OTP:', code);
  }

  onResendCode(): void {
    console.log('Resending OTP code...');
  }

  onNavigateBack(): void {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    } else {
      this.closeDrawer();
    }
  }

  /* Limits */
  title = input<string>('Daily limits');
  currentAmount = input<number>(0);
  maxAmount = input<number>(0);
  // Optional features with default fallbacks
  currentTransactions = input<number | null>(null);
  maxTransactions = input<number | null>(null);
  showTransactions = input<boolean>(true); // Toggle transaction counter on/off
  
  actionLabel = input<string>('View details');

  /* Multiselect */
// 1. Replaces FormControl with a standard Signal
  selectedTagIds = signal<(string | number)[]>([]);

  // 2. Options list stored in a Signal
  myOptions = signal<TagOption[]>([
    { 
      id: 1, 
      label: 'Payroll', 
      color: '#22c55e', 
      bgColor: '#dc262610', 
      textColor: '#16a34a' 
    },
    { 
      id: 2, 
      label: 'Vendor Payments', 
      color: '#3b82f6', 
      bgColor: '#2563eb10', 
      textColor: '#2563eb' 
    },
    { 
      id: 3, 
      label: 'Marketing Reimbursement', 
      color: '#a855f7', 
      bgColor: '#9333ea10', 
      textColor: '#9333ea' 
    }
  ]);


/* File Uploader Reference & Event Handlers */
  uploader = viewChild<FileUploaderComponent>(FileUploaderComponent);

  /** Fixes TS2339 by matching the template method name */
  triggerBrowse(event?: Event): void {
    this.uploader()?.triggerBrowse(event);
  }

  handleVendorDocs(files: File | File[]): void {
    const fileList = Array.isArray(files) ? files : [files];
    console.log('Selected vendor documents:', fileList);
  }

  handleFileError(errorMessage: string): void {
    console.error('Uploader Error:', errorMessage);
  }

  //Dropdown Component setup
selectedEntity = signal<string>('company');

entityOptions: DropdownOption[] = [
  { label: 'Company', value: 'company' },
  { label: 'Individual', value: 'individual' },
  { label: 'Employer', value: 'employer' }
];

/* Alert Component State */
 /** Initialize show to false so it remains hidden on page load */
  readonly alertState = signal<AlertState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  /** Triggered on button click to show the alert */
  triggerNewAlert(type: AlertType): void {
    this.alertState.set({
      show: true,
      type,
      title: 'Company Added',
      message: 'tested successfully ',
    });
  }

  /** Triggered when the alert x badge is clicked */
  handleAlertDismissed(): void {
    this.alertState.update((prev) => ({ ...prev, show: false }));
  }

  /* Input Field */
  /** Input signal state bindings */
  readonly requiredField = signal<string>('');
  readonly commentText = signal<string>('');
  readonly amount = signal<string>('');
  readonly bulkAmount = signal<string>('');
  readonly heroAmount = signal<string>('');

  onApplyToAll(): void {
    console.log('Applying bulk amount to all rows:', this.bulkAmount());
  }
}
