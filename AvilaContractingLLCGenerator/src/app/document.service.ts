import { Injectable } from "@angular/core";
import { LineItem, RoomSection } from "./models";

@Injectable({ providedIn: "root" })
export class DocumentService {
  newItem(): LineItem {
    return { description: "", sqFt: null, totalAmount: null };
  }

  newSection(): RoomSection {
    return { name: "", items: [this.newItem()] };
  }

  grandTotal(sections: RoomSection[]): number {
    return sections.reduce(
      (sum, s) =>
        sum + s.items.reduce((sSum, i) => sSum + (i.totalAmount ?? 0), 0),
      0
    );
  }

  formatCurrency(n: number | null): string {
    if (n == null) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
  }
}
