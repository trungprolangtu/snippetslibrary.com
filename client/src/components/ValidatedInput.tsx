import { forwardRef, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { ValidatedInputProps, ValidatedTextareaProps } from '../types';

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, rules = [], onValidationChange, showError = true, helpText, className, ...props }, ref) => {
    const [error, setError] = useState<string>('');
    const [touched, setTouched] = useState(false);

    const validateInput = (value: string) => {
      for (const rule of rules) {
        if (!rule.test(value)) {
          setError(rule.message);
          onValidationChange?.(false);
          return false;
        }
      }
      setError('');
      onValidationChange?.(true);
      return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      validateInput(value);
      props.onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      validateInput(e.target.value);
      props.onBlur?.(e);
    };

    const hasError = touched && error && showError;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className={cn(hasError && 'text-destructive')}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          className={cn(hasError && 'border-destructive', className)}
          {...props}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {hasError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}
        {helpText && !hasError && (
          <p className="text-sm text-muted-foreground">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ label, rules = [], onValidationChange, showError = true, helpText, className, ...props }, ref) => {
    const [error, setError] = useState<string>('');
    const [touched, setTouched] = useState(false);

    const validateInput = (value: string) => {
      for (const rule of rules) {
        if (!rule.test(value)) {
          setError(rule.message);
          onValidationChange?.(false);
          return false;
        }
      }
      setError('');
      onValidationChange?.(true);
      return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      validateInput(value);
      props.onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setTouched(true);
      validateInput(e.target.value);
      props.onBlur?.(e);
    };

    const hasError = touched && error && showError;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className={cn(hasError && 'text-destructive')}>
            {label}
          </Label>
        )}
        <Textarea
          ref={ref}
          className={cn(hasError && 'border-destructive', className)}
          {...props}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {hasError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}
        {helpText && !hasError && (
          <p className="text-sm text-muted-foreground">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

ValidatedTextarea.displayName = 'ValidatedTextarea';
