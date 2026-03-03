import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { PreviewData } from "./models";

export type { PreviewData };

@Component({
  selector: "app-pdf-preview",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: "./pdf-preview.component.html",
  styleUrl: "./pdf-preview.component.css",
})
export class PdfPreviewComponent {
  constructor(
    public dialogRef: MatDialogRef<PdfPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PreviewData
  ) {}

  close() {
    this.dialogRef.close();
  }

  async downloadPdf() {
    const logoDataUrl = await this.fetchLogoAsDataUrl();
    const win = window.open("", "_blank", "width=960,height=780");
    if (!win) return;
    win.document.title = this.buildFilename();
    win.document.write(this.buildPrintHtml(logoDataUrl));
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  }

  /** Converts avilaLLC.png to a base64 data URL so it embeds in the standalone print window. */
  private async fetchLogoAsDataUrl(): Promise<string> {
    try {
      const resp = await fetch("avilaLLC.png");
      const blob = await resp.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  }

  /** Builds filename like "324CutlerSt_03022026" */
  buildFilename(): string {
    const addr = (this.data.addressWorked || "Document")
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9]/g, "");
    const date = this.data.date
      ? new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
          .format(new Date(this.data.date))
          .replace(/\//g, "")
      : "NoDate";
    return `${addr}_${date}`;
  }

  formatCurrency(n: number | null): string {
    if (n == null) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
  }

  buildPrintHtml(logoDataUrl = ""): string {
    const dateStr = this.data.date
      ? new Intl.DateTimeFormat("en-US").format(new Date(this.data.date))
      : "—";

    const logoHtml = logoDataUrl
      ? `<img src="${logoDataUrl}" alt="Avila Contracting LLC" class="logo" />`
      : "";

    const rows = this.data.sections
      .map(
        (s) => `
        <tr class="section-row">
          <td colspan="3">${s.name || ""}</td>
        </tr>
        ${s.items
          .map(
            (item) => `
          <tr>
            <td class="td-desc">${item.description || ""}</td>
            <td class="td-sqft">${item.sqFt ?? ""}</td>
            <td class="td-amount">${item.totalAmount != null ? this.formatCurrency(item.totalAmount) : ""}</td>
          </tr>`
          )
          .join("")}`
      )
      .join("");

    const grandTotal = this.formatCurrency(this.data.grandTotal);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${this.buildFilename()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #222; background: #fff; }
    .doc { padding: 48px; max-width: 800px; margin: 0 auto; }
    .doc-header { display: flex; justify-content: space-between; align-items: flex-start;
      border-bottom: 3px solid #1a237e; padding-bottom: 20px; margin-bottom: 28px; }
    .logo { height: 80px; width: auto; object-fit: contain; }
    .company-name { font-size: 22px; font-weight: 700; color: #1a237e; margin-top: 6px; }
    .company-tagline { font-size: 11px; color: #666; margin-top: 3px; }
    .doc-type { font-size: 28px; font-weight: 700; color: #1a237e; text-transform: uppercase; text-align: right; }
    .doc-date { font-size: 12px; color: #666; text-align: right; margin-top: 6px; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 28px; }
    .addr-block h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin-bottom: 6px; }
    .addr-block p { font-size: 13px; line-height: 1.65; }
    .bold { font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1a237e; }
    th { color: #fff; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; text-align: left; }
    th.right, td.td-amount { text-align: right; }
    tbody tr { border-bottom: 1px solid #e0e0e0; }
    tbody tr:nth-child(even) { background: #f5f7ff; }
    td { padding: 8px 12px; }
    td.td-desc { width: 60%; }
    td.td-sqft { width: 15%; }
    td.td-amount { width: 20%; }
    tr.section-row td { background: #e8eaf6 !important; font-weight: 700; color: #1a237e; }
    .total-wrap { display: flex; justify-content: flex-end; margin-top: 20px; }
    .total-box { border: 2px solid #1a237e; border-radius: 6px; padding: 12px 20px; text-align: right; min-width: 210px; }
    .total-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #777; }
    .total-value { font-size: 24px; font-weight: 700; color: #1a237e; margin-top: 4px; }
    .doc-footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #555; line-height: 1.8; }
    .payable { font-size: 13px; font-weight: 600; color: #222; margin-bottom: 6px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="doc">
    <div class="doc-header">
      <div>
        ${logoHtml}
        <div class="company-name">Avila Contracting LLC</div>
        <div class="company-tagline">Professional Tile Installation</div>
      </div>
      <div>
        <div class="doc-type">${this.data.docType}</div>
        <div class="doc-date">Date: ${dateStr}</div>
      </div>
    </div>
    <div class="addresses">
      <div class="addr-block">
        <h4>Bill To</h4>
        <p class="bold">${this.data.clientName || "—"}</p>
        <p>${this.data.clientAddress || ""}</p>
        <p>${this.data.clientPhone || ""}</p>
      </div>
      <div class="addr-block">
        <h4>Address Worked</h4>
        <p class="bold">${this.data.addressWorked || "—"}</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Sq Ft</th>
          <th class="right">Total Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="total-wrap">
      <div class="total-box">
        <div class="total-label">Total Amount</div>
        <div class="total-value">${grandTotal}</div>
      </div>
    </div>
    <div class="doc-footer">
      <div class="payable">Makes checks payable to: Avila Contracting LLC</div>
      <div>Thank you for choosing Avila Contracting LLC. If you have any questions regarding this ${this.data.docType.toLowerCase()} or need further assistance, please feel free to contact us:</div>
      <div><strong>Email / Phone: Avilacontractingllc4@gmail.com &nbsp;|&nbsp; (+1) 984-202-6576</strong></div>
    </div>
  </div>
</body>
</html>`;
  }
}
