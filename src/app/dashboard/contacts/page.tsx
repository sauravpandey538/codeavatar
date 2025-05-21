"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImportSheet } from "@/components/contacts/import-sheet";
import { AddContact } from "@/components/contacts/add-contact";
import { ContactList } from "@/components/contacts/contact-list";
import Link from "next/link";

export default function ContactsPage() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContactAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <div className="flex gap-4">
          <ImportSheet onImportSuccess={handleContactAdded} />
          <Button onClick={() => setShowAddContact(true)}>Add Contact</Button>
        </div>
      </div>

      <ContactList refreshTrigger={refreshTrigger} />

      <AddContact
        open={showAddContact}
        onOpenChange={setShowAddContact}
        onContactAdded={handleContactAdded}
      />

      <Link href="/dashboard">
        <Button variant={"outline"} className="my-4">
          Go Back
        </Button>
      </Link>
    </div>
  );
}
