 import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, Label, Select } from "@/components/ui";

export default function Hr() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    tripPurpose: "",
    preferences: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push({
      pathname: "/itinerary",
      query: formData
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">
          Plan Your Perfect Destination
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Destination</Label>
            <Input name="destination" value={formData.destination} onChange={handleChange} required />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
          <div>
            <Label>Budget</Label>
            <Input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
          </div>
          <div>
            <Label>Trip Purpose</Label>
            <Select name="tripPurpose" value={formData.tripPurpose} onChange={handleChange} required>
              <option value="">Select Purpose</option>
              <option value="leisure">Leisure</option>
              <option value="business">Business</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
            </Select>
          </div>
          <div>
            <Label>Preferences</Label>
            <Input name="preferences" value={formData.preferences} onChange={handleChange} placeholder="E.g., beach, mountains, museums" />
          </div>
          <Button type="submit" className="w-full">Generate Itinerary</Button>
        </form>
      </div>
    </div>
  );
}
