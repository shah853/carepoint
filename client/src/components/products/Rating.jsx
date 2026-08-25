function Rating({ value, count }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <span key={star} className={star <= value ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
      {count !== undefined && (
        <span className="text-sm text-gray-500 ml-1">({count})</span>
      )}
    </div>
  );
}

export default Rating;