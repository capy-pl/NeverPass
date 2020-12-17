import { current } from '@reduxjs/toolkit';
import store from './../store';

export function validateEmail(email: string): Boolean {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function capitalize(message: string): string {
  return `${message.charAt(0).toUpperCase()}${message.slice(1)}`;
}

export function getPK(): string {
  const currentState = store.getState();
  if (currentState.user && currentState.user.pk) {
    return currentState.user.pk;
  }
  throw new Error("pk not found")
}