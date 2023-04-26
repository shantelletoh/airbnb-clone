import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import SearchPlaces from "../Components/Home/SearchPlaces";
import PlacesList from "../Components/Home/PlacesList";
import PerksFilter from "../Components/Home/PerksFilter";

export default function IndexPage() {
  const [object, setObject] = useState({});
  const [filterPerks, setFilterPerks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getAllPlaces = async () => {
      try {
        const url = `${
          axios.defaults.baseURL
        }/places?perks=${filterPerks.toString()}&search=${search}`;
        const { data } = await axios.get(url);
        setObject(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllPlaces();
  }, [filterPerks, search]);

  return (
    // <div className="flex flex-auto">
    // <Sidebar />
    <>
      <SearchPlaces setSearch={(search) => setSearch(search)} />

      <div>
        <div>
          <PerksFilter
            filterPerks={filterPerks}
            perks={object.perksRes ? object.perksRes : []}
            setFilterPerks={(perk) => setFilterPerks(perk)}
          />
        </div>
        <div>
          <PlacesList places={object.places ? object.places : []} />
        </div>
      </div>
    </>
  );
}
