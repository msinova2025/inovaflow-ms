import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return value;
}

export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 14) {
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  return value;
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  }
  return value;
}


export function formatCPFOrCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 11) {
    return formatCPF(value);
  } else {
    return formatCNPJ(value);
  }
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const openBase64InNewTab = (base64Data: string, fallbackType: string = 'application/pdf') => {
  let type = fallbackType;
  let constData = base64Data;

  // Check if it has the data URI scheme
  if (base64Data.includes(',')) {
    const parts = base64Data.split(',');
    constData = parts[1];

    // Try to extract mime type from the first part (e.g., "data:image/png;base64")
    const mimeMatch = parts[0].match(/data:(.*?);/);
    if (mimeMatch && mimeMatch[1]) {
      type = mimeMatch[1];
    }
  }

  try {
    const byteCharacters = atob(constData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (e) {
    console.error("Error opening base64:", e);
    // Fallback: try opening directly if it is a URL
    if (base64Data.startsWith('http')) {
      window.open(base64Data, '_blank');
    }
  }
};
