import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImportSheetProps {
  onImportSuccess?: () => void;
}

export function ImportSheet({ onImportSuccess }: ImportSheetProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [range, setRange] = useState("A1:F100"); // Default range
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contacts/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spreadsheetId,
          range,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import contacts");
      }

      toast({
        title: "Success",
        description: `Imported ${data.contacts.length} contacts successfully`,
      });

      setOpen(false);
      setSpreadsheetId("");
      setRange("A1:F100");

      // Call onImportSuccess callback
      onImportSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to import contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import from Google Sheets</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Contacts from Google Sheets</DialogTitle>
          <DialogDescription>
            Enter your Google Sheet details to import contacts. The sheet should
            have columns for name, email, phone, company, job title, and notes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
            <Input
              id="spreadsheetId"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="Enter spreadsheet ID"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="range">Range</Label>
            <Input
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="e.g., A1:F100"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleImport}
            disabled={!spreadsheetId || !range || loading}
          >
            {loading ? "Importing..." : "Import Contacts"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
