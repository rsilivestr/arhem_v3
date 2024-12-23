import { ValidationRule } from 'react-hook-form';

export const enum EventButton {
  Left = 0,
  Middle = 1,
  Right = 2,
  Back = 3,
  Forward = 4,
}

export const required: ValidationRule<boolean> = {
  value: true,
  message: 'Поле обязательно',
};
