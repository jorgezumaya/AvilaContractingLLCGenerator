export enum Status {
  E = "Estimate",
  I = "Invoice",
}

export interface LineItem {
  description: string;
  sqFt: number | null;
  totalAmount: number | null;
}

export interface RoomSection {
  name: string;
  items: LineItem[];
}

export interface ClientInfo {
  name: string;
  phone: string;
  address: string;
  addressWorked: string;
}

export interface PreviewData {
  docType: string;
  date: Date | null;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  addressWorked: string;
  sections: RoomSection[];
  grandTotal: number;
}

export interface Contact {
  id?: string;
  name: string;
  phone: string;
  address: string;
}
