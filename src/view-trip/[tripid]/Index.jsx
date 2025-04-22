import { db } from "@/service/firebaseConfig"; 
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import InfoSection from "../components/InfoSection";


function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) return;

      try {
        setLoading(true);
        const docRef = doc(db, "AITrips", tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTrip(docSnap.data());
        } else {
          setError("No trip found");
          toast.error("No trip found with this ID");
        }
      } catch (err) {
        setError("Failed to fetch trip data");
        toast.error("Failed to load trip information");
        console.error("Error fetching trip:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  if (loading) {
    return <div className="p-10 text-center">Loading trip details...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!trip) {
    return <div className="p-10 text-center">No trip data available</div>;
  }

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <InfoSection trip={trip} />
      
    </div>
  );
}

export default ViewTrip;
