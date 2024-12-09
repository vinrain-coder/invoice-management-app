"use client";

import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { Textarea } from "./ui/textarea";
import { SubmitButton } from "./SubmitButton";
import { createInvoice } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceShema } from "@/app/utils/zodSchemas";
import { formatCurrency } from "@/app/utils/formatCurrency";

interface iAppProps {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

export function CreateInvoice({
  address,
  email,
  firstName,
  lastName,
}: iAppProps) {
  const [lastResult, action] = useActionState(createInvoice, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceShema,
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currency, setCurrency] = useState("KES");

  const calculateTotal = (Number(quantity) || 0) * (Number(rate) || 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          <input
            type="hidden"
            name={fields.date.name}
            value={selectedDate.toISOString()}
          />
          <input
            type="hidden"
            name={fields.total.name}
            value={calculateTotal}
          />

          <div className="flex flex-col gap-1 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={fields.invoiceName.initialValue}
                placeholder="Test 123"
              />
            </div>
            <p className="text-sm text-red-500">{fields.invoiceName.errors}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="">
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted items-center">
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={fields.invoiceNumber.initialValue}
                  className="rounded-l-none"
                  placeholder="5"
                />
              </div>
              <p className="text-sm text-red-500">
                {fields.invoiceNumber.errors}
              </p>
            </div>
            <div className="">
              <Label>Currency</Label>
              <Select
                defaultValue={fields.currency.initialValue}
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">Kenyan Shilling --KES</SelectItem>
                  <SelectItem value="USD">
                    United States Dollar --USD
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-500">{fields.currency.errors}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="">
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                  placeholder="Your Name"
                  defaultValue={firstName + " " + lastName}
                />
                <p className="text-red-500 text-sm">{fields.fromName.errors}</p>
                <Input
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  placeholder="Your Email"
                  defaultValue={email}
                />
                <p className="text-red-500 text-sm">
                  {fields.fromEmail.errors}
                </p>

                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  placeholder="Your Address"
                  defaultValue={address}
                />
                <p className="text-red-500 text-sm">
                  {fields.fromAddress.errors}
                </p>
              </div>
            </div>
            <div className="">
              <Label>To</Label>
              <div className="space-y-2">
                <Input
                  name={fields.clientName.name}
                  key={fields.clientName.key}
                  defaultValue={fields.clientName.initialValue}
                  placeholder="Client Name"
                />
                <p className="text-red-500 text-sm">
                  {fields.clientName.errors}
                </p>

                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={fields.clientEmail.initialValue}
                  placeholder="Client Email"
                />
                <p className="text-red-500 text-sm">
                  {fields.clientEmail.errors}
                </p>

                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={fields.clientAddress.initialValue}
                  placeholder="Client Address"
                />
                <p className="text-red-500 text-sm">
                  {fields.clientAddress.errors}
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      new Intl.DateTimeFormat("en-US", {
                        dateStyle: "long",
                      }).format(selectedDate)
                    ) : (
                      <span>Pick a Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-red-500 text-sm">{fields.date.errors}</p>
            </div>
            <div className="">
              <Label>Invoice Due</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={fields.dueDate.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.dueDate.errors}</p>
            </div>
          </div>
          <div className="">
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6">
                <Textarea
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={fields.invoiceItemDescription.initialValue}
                  placeholder="Item name and description"
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemDescription.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemQuantity.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  type="number"
                  placeholder="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemRate.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input
                  value={formatCurrency({
                    amount: calculateTotal,
                    currency: currency as any,
                  })}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span className="">Subtotal</span>
                <span className="">
                  {formatCurrency({
                    amount: calculateTotal,
                    currency: currency as any,
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Total ({currency})</span>
                <span className="font-medium underline underline-offset-2">
                  {formatCurrency({
                    amount: calculateTotal,
                    currency: currency as any,
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="">
            <Label>Note</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={fields.note.initialValue}
              placeholder="Add your note/s right here..."
            />
            <p className="text-red-500 text-sm">{fields.note.errors}</p>
          </div>
          <div className="flex items-center justify-end mt-6">
            <div className="">
              <SubmitButton text="Send invoice to client" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
