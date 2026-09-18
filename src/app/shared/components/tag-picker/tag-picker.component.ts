import {
  Component,
  input,
  model,
  signal,
  computed,
  forwardRef,
  ElementRef,
  HostListener,
  inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

export interface TagOption {
  id: string | number;
  label: string;
  color: string;
  bgColor?: string;
  textColor?: string;
}

@Component({
  selector: 'app-tag-picker',
  imports: [IconComponent, ButtonComponent],
  templateUrl: './tag-picker.component.html',
  styleUrl: './tag-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagPickerComponent),
      multi: true
    }
  ]
})
export class TagPickerComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  // 1. SIGNAL INPUTS (Read-only configurations)
  options = input<TagOption[]>([]);
  maxVisibleTags = input<number>(2);
  placeholder = input<string>('Search or create label');
  allowCreate = input<boolean>(true);

  // 2. SIGNAL MODEL (Replaces @Input / @Output for two-way binding)
  // This allows parents to use [(selectedIds)]="mySignal" natively!
  selectedIds = model<(string | number)[]>([]);

  // 3. INTERNAL STATE SIGNALS
  searchTerm = signal<string>('');
  isOpen = signal<boolean>(false);
  isDisabled = signal<boolean>(false);
  customOptions = signal<TagOption[]>([]);

  // 4. COMPUTED SIGNALS (Auto-updates when dependencies change)
  allOptions = computed(() => [...this.options(), ...this.customOptions()]);

  selectedOptions = computed(() => {
    const ids = this.selectedIds(); // Tracks the model signal
    return this.allOptions().filter((opt) => ids.includes(opt.id));
  });

  visibleTags = computed(() => this.selectedOptions().slice(0, this.maxVisibleTags()));

  overflowCount = computed(() => Math.max(0, this.selectedOptions().length - this.maxVisibleTags()));

  filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.allOptions();
    return this.allOptions().filter((opt) => opt.label.toLowerCase().includes(term));
  });

  canCreate = computed(() => {
    const term = this.searchTerm().trim();
    if (!this.allowCreate() || !term) return false;
    return !this.allOptions().some((opt) => opt.label.toLowerCase() === term.toLowerCase());
  });

  // --- CONTROL VALUE ACCESSOR LOGIC ---
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  toggleDropdown(): void {
    if (!this.isDisabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  toggleOption(id: string | number, event?: Event): void {
    event?.stopPropagation();
    if (this.isDisabled()) return;

    this.selectedIds.update(current => {
      const updated = current.includes(id) 
        ? current.filter(val => val !== id) 
        : [...current, id];
      
      this.onChange(updated); // Sync with Reactive Forms
      return updated;         // Sync with Signal Model
    });
    
    this.onTouched();
  }

  removeTag(id: string | number, event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.toggleOption(id);
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    
    this.selectedIds.set([]);
    this.onChange([]);
    this.onTouched();
  }

  createNewOption(): void {
    const term = this.searchTerm().trim();
    if (!term) return;

    const newOpt: TagOption = {
      id: `custom_${Date.now()}`,
      label: term,
      color: '#a855f7',
      bgColor: '#f3e8ff',
      textColor: '#6b21a8'
    };

    this.customOptions.update((opts) => [...opts, newOpt]);
    this.toggleOption(newOpt.id);
    this.searchTerm.set('');
  }

  isSelected(id: string | number): boolean {
    return this.selectedIds().includes(id);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen()) this.onTouched();
      this.isOpen.set(false);
    }
  }

  // CVA Overrides -> Syncs parent form state into our Signal Model
  writeValue(value: any): void {
    this.selectedIds.set(Array.isArray(value) ? value : []);
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled.set(isDisabled); }
}
