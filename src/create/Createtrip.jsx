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
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

function LocationInput({ onSelect }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            search
          )}&format=json&addressdetails=1&limit=5`
        );

        if (!res.ok) throw new Error("Failed to fetch suggestions");

        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="relative">
      <Input
        placeholder="Enter a destination"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && (
        <div className="absolute z-10 bg-white border mt-1 w-full text-center p-2 text-sm text-gray-400">
          Loading...
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white shadow-md border rounded mt-1 w-full max-h-60 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <li
              key={`${item.place_id}-${idx}`}
              onClick={() => {
                setSearch(item.display_name);
                onSelect(item.display_name);
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
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: "",
    noOfDays: "",
    budget: "",
    traveler: "",
  });

  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useNavigate();

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignIn = () => {
    setShowDialog(false);
    openSignIn({
      afterSignInUrl: window.location.href,
    });
  };

  const SaveAiTrip = async (TripData) => {
    setIsSubmitting(true);
    try {
      const docId = Date.now().toString();
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      // Validate user data
      if (!userEmail) {
        throw new Error("User email not available");
      }

      const tripDoc = {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail,
        id: docId,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "AITrips", docId), tripDoc);
      navigate("/view-trip/" + docId);
      return docId;
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
    router("/view-trip/" + docId);
  };

  const handleGenerateTrip = async () => {
    if (!isLoaded) {
      toast("Authentication system is loading, please wait");
      return;
    }

    if (!isSignedIn) {
      setShowDialog(true);
      toast("Please sign in to generate your trip");
      return;
    }

    // Validate form data
    const { location, noOfDays, budget, traveler } = formData;
    if (!location || !noOfDays || !budget || !traveler) {
      toast("Please fill all the required details");
      return;
    }

    if (noOfDays <= 0) {
      toast("Trip duration must be at least 1 day");
      return;
    }

    setIsSubmitting(true);

    try {
      const final_prompt = AI_PROMPT.replace("{location}", location)
        .replaceAll("{totalDays}", noOfDays)
        .replace("{traveler}", traveler)
        .replace("{budget}", budget);

      console.log("Generated Prompt:", final_prompt);

      // TODO: Replace with actual API call
      const response = JSON.stringify({
        itinerary: `Sample trip plan for ${location}`,
        details: {
          location,
          duration: `${noOfDays} days`,
          budget,
          travelers: traveler,
        },
      });

      await SaveAiTrip(response);
      toast.success("Trip generated successfully!");
    } catch (error) {
      console.error("Error generating trip:", error);
      if (error.message === "User email not available") {
        toast.error("Please sign out and sign in again");
      } else {
        toast.error("Failed to generate trip. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?{" "}
            <span className="text-red-500">*</span>
          </h2>
          <LocationInput
            onSelect={(val) => handleInputChange("location", val)}
          />
          {formData.location && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {formData.location}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?{" "}
            <span className="text-red-500">*</span>
          </h2>
          <Input
            placeholder="Ex. 4"
            type="number"
            min="1"
            value={formData.noOfDays}
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            What is Your Budget? <span className="text-red-500">*</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.title}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-shadow ${
                  formData.budget === item.title ? "shadow-lg border-black" : ""
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
            Who do you plan on traveling with?{" "}
            <span className="text-red-500">*</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item) => (
              <div
                key={item.people}
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-shadow ${
                  formData.traveler === item.people
                    ? "shadow-lg border-black"
                    : ""
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

      <div className="mt-10 flex justify-end">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-md w-full sm:w-auto"
          onClick={handleGenerateTrip}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Generating..." : "Generate Trip 🤩"}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription className="pt-4">
              You need to sign in to generate your personalized trip itinerary.
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Maybe Later
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Createtrip;
