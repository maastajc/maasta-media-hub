import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MultipleTicketTypesProps {
  ticketTypes: TicketType[];
  onTicketTypesChange: (ticketTypes: TicketType[]) => void;
  disabled?: boolean;
}

export const MultipleTicketTypes = ({ 
  ticketTypes, 
  onTicketTypesChange, 
  disabled = false 
}: MultipleTicketTypesProps) => {
  
  const addTicketType = () => {
    const newTicketType: TicketType = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      quantity: 100
    };
    onTicketTypesChange([...ticketTypes, newTicketType]);
  };

  const removeTicketType = (id: string) => {
    onTicketTypesChange(ticketTypes.filter(ticket => ticket.id !== id));
  };

  const updateTicketType = (id: string, field: keyof TicketType, value: string | number) => {
    onTicketTypesChange(
      ticketTypes.map(ticket => 
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Ticket Types</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTicketType}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Ticket
        </Button>
      </div>

      {ticketTypes.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            No ticket types added. Click "Add Ticket" to create your first ticket type.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ticketTypes.map((ticket, index) => (
            <Card key={ticket.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label htmlFor={`ticket-name-${ticket.id}`} className="text-xs">
                      Ticket Name *
                    </Label>
                    <Input
                      id={`ticket-name-${ticket.id}`}
                      placeholder="e.g., VIP, Early Bird, General"
                      value={ticket.name}
                      onChange={(e) => updateTicketType(ticket.id, 'name', e.target.value)}
                      disabled={disabled}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`ticket-price-${ticket.id}`} className="text-xs">
                      Price (₹)
                    </Label>
                    <Input
                      id={`ticket-price-${ticket.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={ticket.price}
                      onChange={(e) => updateTicketType(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                      disabled={disabled}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`ticket-quantity-${ticket.id}`} className="text-xs">
                      Quantity Available
                    </Label>
                    <Input
                      id={`ticket-quantity-${ticket.id}`}
                      type="number"
                      min="1"
                      placeholder="100"
                      value={ticket.quantity}
                      onChange={(e) => updateTicketType(ticket.id, 'quantity', parseInt(e.target.value) || 1)}
                      disabled={disabled}
                    />
                  </div>
                  
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTicketType(ticket.id)}
                      disabled={disabled}
                      className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};