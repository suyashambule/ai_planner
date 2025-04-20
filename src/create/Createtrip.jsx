import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constant/option";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function LocationInput({ onSelect }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 2) {
        setSuggestions([]);
        return;
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          search
        )}&format=json&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    };

    const debounce = setTimeout(fetchSuggestions, 100); // debounce input
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="relative">
      <Input
        placeholder="Enter a destination"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white shadow-md border rounded mt-1 w-full">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                setSearch(item.display_name);
                onSelect(item.display_name); // Pass to parent
                setSuggestions([]);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Createtrip() {
  const [formData, setFormData] = useState({
    location: "",
    noOfDays: "",
    budget: "",
    traveler: "",
  });

  const [showDialog, setShowDialog] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateTrip = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setShowDialog(true);
      toast("Please login to generate trip");
      return;
    }

    if (
      (formData.noOfDays > 5 && !formData.location) ||
      !formData.budget ||
      !formData.traveler
    ) {
      toast("Please fill all the details");
      return;
    }

    const final_prompt = AI_PROMPT.replace("{location}", formData.location)
      .replaceAll("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.traveler)
      .replace("{budget}", formData.budget);

    console.log("Generated Prompt:", final_prompt);

    // TODO: Send this prompt to backend/AI API here
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
          <LocationInput
            onSelect={(val) => handleInputChange("location", val)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder="Ex. 4"
            type="number"
            value={formData.noOfDays}
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData.budget === item.title && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData.traveler === item.people && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 justify-end flex">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-md"
          onClick={handleGenerateTrip}
        >
          Generate Trip 🤩
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                Please log in to generate your personalized trip itinerary.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Createtrip;
