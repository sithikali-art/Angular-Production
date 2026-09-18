import {
  Component,
  input,
  output,
  signal,
  ElementRef,
  viewChild
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-file-uploader',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
})
export class FileUploaderComponent {
  // Configurable Signal Inputs
  title = input<string>('Drag and drop your file here');
  subtitle = input<string>('or click to browse from your computer');
  chooseBtnText = input<string>('Choose file');
  chooseIcon = input<string>('upload'); // Tabler icon name for the button
  sampleBtnText = input<string>('Use sample');
  sampleIcon = input<string>(''); // Optional icon for sample button
  iconName = input<string>('upload'); // Main top circle icon
  
  accept = input<string>('.csv, .xlsx, .pdf');
  maxSizeMB = input<number>(10);
  showSample = input<boolean>(true);
  multiple = input<boolean>(false);

  // Signal Outputs
  fileSelected = output<File | File[]>();
  sampleRequested = output<void>();
  fileError = output<string>();

  // Element Reference
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // Drag State
  isDragging = signal<boolean>(false);

  triggerBrowse(event?: Event): void {
    event?.stopPropagation();
    this.fileInput()?.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files && inputEl.files.length > 0) {
      this.processFiles(Array.from(inputEl.files));
    }
  }

  // Drag & Drop Event Handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  onSampleClick(event: Event): void {
    event.stopPropagation();
    this.sampleRequested.emit();
  }

  private processFiles(files: File[]): void {
    const maxBytes = this.maxSizeMB() * 1024 * 1024;
    
    // Size Validation
    const oversizedFile = files.find((f) => f.size > maxBytes);
    if (oversizedFile) {
      this.fileError.emit(`File "${oversizedFile.name}" exceeds limit of ${this.maxSizeMB()}MB.`);
      this.resetInput();
      return;
    }

    // Extension & MIME Validation
    const allowedRules = this.accept()
      .split(',')
      .map((rule) => rule.trim().toLowerCase());

    const invalidFile = files.find((file) => {
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type.toLowerCase();
      
      return !allowedRules.some((rule) => 
        rule === fileExt || (rule.includes('/') && mimeType === rule)
      );
    });

    if (invalidFile) {
      this.fileError.emit(`File "${invalidFile.name}" is not supported. Allowed formats: ${this.accept()}`);
      this.resetInput();
      return;
    }

    // Emit Validated Files
    if (this.multiple()) {
      this.fileSelected.emit(files);
    } else {
      this.fileSelected.emit(files[0]);
    }

    this.resetInput();
  }

  private resetInput(): void {
    const inputEl = this.fileInput()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }
}
