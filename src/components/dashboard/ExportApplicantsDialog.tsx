
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportApplicantsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: any[];
  auditionTitle: string;
}

export const ExportApplicantsDialog = ({ 
  isOpen, 
  onClose, 
  applicants, 
  auditionTitle 
}: ExportApplicantsDialogProps) => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    email: true,
    phone: true,
    category: true,
    experience: true,
    location: true,
    applicationDate: true,
    status: true,
    notes: true
  });

  const handleFieldChange = (field: string, checked: boolean) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const generateCSV = () => {
    const headers = [];
    const fields = [];

    if (selectedFields.name) {
      headers.push('Name');
      fields.push('name');
    }
    if (selectedFields.email) {
      headers.push('Email');
      fields.push('email');
    }
    if (selectedFields.phone) {
      headers.push('Phone');
      fields.push('phone');
    }
    if (selectedFields.category) {
      headers.push('Category');
      fields.push('category');
    }
    if (selectedFields.experience) {
      headers.push('Experience Level');
      fields.push('experience');
    }
    if (selectedFields.location) {
      headers.push('Location');
      fields.push('location');
    }
    if (selectedFields.applicationDate) {
      headers.push('Application Date');
      fields.push('applicationDate');
    }
    if (selectedFields.status) {
      headers.push('Status');
      fields.push('status');
    }
    if (selectedFields.notes) {
      headers.push('Notes');
      fields.push('notes');
    }

    const csvContent = [
      headers.join(','),
      ...applicants.map(app => {
        const profile = app.profiles || {};
        const row = [];
        
        fields.forEach(field => {
          switch (field) {
            case 'name':
              row.push(`"${profile.full_name || 'N/A'}"`);
              break;
            case 'email':
              row.push(`"${profile.email || 'N/A'}"`);
              break;
            case 'phone':
              row.push(`"${profile.phone_number || 'N/A'}"`);
              break;
            case 'category':
              row.push(`"${profile.category || 'N/A'}"`);
              break;
            case 'experience':
              row.push(`"${profile.experience_level || 'N/A'}"`);
              break;
            case 'location':
              const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
              row.push(`"${location || 'N/A'}"`);
              break;
            case 'applicationDate':
              row.push(`"${new Date(app.application_date).toLocaleDateString()}"`);
              break;
            case 'status':
              row.push(`"${app.status || 'N/A'}"`);
              break;
            case 'notes':
              row.push(`"${app.notes || 'N/A'}"`);
              break;
            default:
              row.push('""');
          }
        });
        
        return row.join(',');
      })
    ].join('\n');

    return csvContent;
  };

  const generatePDF = () => {
    // Create a simple HTML table for PDF generation
    const selectedData = applicants.map(app => {
      const profile = app.profiles || {};
      const data: any = {};
      
      if (selectedFields.name) data.name = profile.full_name || 'N/A';
      if (selectedFields.email) data.email = profile.email || 'N/A';
      if (selectedFields.phone) data.phone = profile.phone_number || 'N/A';
      if (selectedFields.category) data.category = profile.category || 'N/A';
      if (selectedFields.experience) data.experience = profile.experience_level || 'N/A';
      if (selectedFields.location) {
        const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
        data.location = location || 'N/A';
      }
      if (selectedFields.applicationDate) data.applicationDate = new Date(app.application_date).toLocaleDateString();
      if (selectedFields.status) data.status = app.status || 'N/A';
      if (selectedFields.notes) data.notes = app.notes || 'N/A';
      
      return data;
    });

    // Create HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Applicants Report - ${auditionTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Applicants Report</h1>
          <p><strong>Audition:</strong> ${auditionTitle}</p>
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Applicants:</strong> ${applicants.length}</p>
          
          <table>
            <thead>
              <tr>
                ${Object.keys(selectedData[0] || {}).map(key => `<th>${key.charAt(0).toUpperCase() + key.slice(1)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${selectedData.map(row => 
                `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    return htmlContent;
  };

  const handleExport = () => {
    try {
      if (exportFormat === "csv") {
        const csvContent = generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${auditionTitle.replace(/\s+/g, '_')}_applicants.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        const htmlContent = generatePDF();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${auditionTitle.replace(/\s+/g, '_')}_applicants.html`;
        link.click();
        window.URL.revokeObjectURL(url);
      }

      toast({
        title: "Export Successful",
        description: `Applicants data exported as ${exportFormat.toUpperCase()}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download size={20} />
            Export Applicants
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: "csv" | "pdf") => setExportFormat(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table size={16} />
                    CSV (Excel Compatible)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    HTML Report
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Select Fields to Export</Label>
            <div className="space-y-2">
              {Object.entries(selectedFields).map(([field, checked]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={(checked) => handleFieldChange(field, !!checked)}
                  />
                  <Label htmlFor={field} className="text-sm">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Audition:</strong> {auditionTitle}</p>
            <p><strong>Total Applicants:</strong> {applicants.length}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={applicants.length === 0 || Object.values(selectedFields).every(v => !v)}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export {exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
