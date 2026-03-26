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

export type JobCategory = 'floor' | 'wall' | 'shower' | 'bathroom' | 'kitchen' | 'other';

export interface Job {
  id?: string;
  title: string;
  description?: string;
  category: JobCategory;
  imageUrl: string;      // Firebase Storage download URL
  storagePath: string;   // e.g. 'jobs/hex-floor.jpg'  — needed for future deletion
  featured: boolean;
  createdAt: any;        // Firestore Timestamp — use any to avoid importing Timestamp in models
}
