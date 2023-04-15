export default function Avatar({ userId, username, online }) {
  const colors = [
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
  ];
  const userIdBase10 = parseInt(userId, 16); // convert userIds to base 10 nums (orig hex)
  const colorIndex = userIdBase10 % colors.length; // assign a color given base 10 userIds
  const color = colors[colorIndex];

  return (
    <div
      className={
        "w-8 h-8 relative bg-red-200 rounded-full flex items-center " + color
      }
    >
      <div className="text-center w-full opacity-70">{username[0]}</div>
      {online && (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}

      {!online && (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
}
