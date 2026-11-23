import { MAX_QUANTITY } from './OrderRequestForm.props';

const digitCount = (value) => value.replace(/\D/g, '').length;

// What's wrong with each field, as translation keys ({} when all is fine).
// Mirrors the database checks, a little stricter on the phone so typos are caught here.
export function validateOrder(form, showQuantity) {
  const errors = {};
  const phone = form.phone.trim();
  const quantity = Number(form.quantity);

  if (form.name.trim().length < 2) errors.name = 'orderForm.errors.name';
  if (!phone) errors.phone = 'orderForm.errors.phoneMissing';
  else if (!/^\+?[0-9 ()/.-]+$/.test(phone) || digitCount(phone) < 8 || digitCount(phone) > 15) {
    errors.phone = 'orderForm.errors.phone';
  }
  if (form.city.trim().length < 2) errors.city = 'orderForm.errors.city';
  // The address may be left out (the family asks for it on the phone), but not half written.
  const addressLength = form.address.trim().length;
  if (addressLength > 0 && addressLength < 3) errors.address = 'orderForm.errors.address';
  if (showQuantity && !(Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY)) {
    errors.quantity = 'orderForm.errors.quantity';
  }
  return errors;
}
