export default function PerksFilter({ perks, filterPerks, setFilterPerks }) {
  const onChange = ({ currentTarget: input }) => {
    if (input.checked) {
      const state = [...filterPerks, input.value];
      setFilterPerks(state);
    } else {
      const state = filterPerks.filter((val) => val !== input.value);
      setFilterPerks(state);
    }
  };

  return (
    <div>
      <h1>Filter By Perks</h1>
      <div>
        {perks.map((perk) => (
          <div key={perk}>
            <input type="checkbox" value={perk} onChange={onChange} />
            <p>{perk}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
