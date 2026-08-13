import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { COUNTRY_CODES, CountryCode, DEFAULT_COUNTRY_CODE } from 'src/app/data/country-codes';

// Champ téléphone réutilisable : sélecteur d'indicatif pays + numéro local.
// Compatible [(ngModel)] via ControlValueAccessor — la valeur exposée est la
// chaîne complète "+223 76111111" (indicatif + espace + numéro local).
@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PhoneInputComponent),
    multi: true
  }]
})
export class PhoneInputComponent implements ControlValueAccessor {
  @Input() required = false;
  @Input() placeholder = 'XX XX XX XX';

  pays: CountryCode[] = COUNTRY_CODES;
  selectedIndicatif: string = DEFAULT_COUNTRY_CODE.indicatif;
  numeroLocal = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (!value) {
      this.numeroLocal = '';
      this.selectedIndicatif = DEFAULT_COUNTRY_CODE.indicatif;
      return;
    }
    // Reconnaît un indicatif déjà présent dans la valeur (ex: "+223 76111111")
    const match = this.pays
      .sort((a, b) => b.indicatif.length - a.indicatif.length)
      .find(p => value.startsWith(p.indicatif));
    if (match) {
      this.selectedIndicatif = match.indicatif;
      this.numeroLocal = value.substring(match.indicatif.length).trim();
    } else {
      // Ancien format sans indicatif (numéros existants avant cette fonctionnalité)
      this.selectedIndicatif = DEFAULT_COUNTRY_CODE.indicatif;
      this.numeroLocal = value.trim();
    }
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  private emit(): void {
    const numero = (this.numeroLocal || '').trim();
    this.onChange(numero ? `${this.selectedIndicatif} ${numero}` : '');
    this.onTouched();
  }

  onIndicatifChange(): void { this.emit(); }
  onNumeroChange(): void { this.emit(); }
}
