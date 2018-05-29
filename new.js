const editMap = (arr) => {

return arr.reduce(function(prev, curr, index, arr) {
  const states = [...prev.tracks.get(), ...curr.tracks.get()];
  const carriers = [prev.name, curr.name];
  const next_tracking_ids = [prev.next_tracking_ids, curr.next_tracking_ids];

  return {
    states,
    carriers,
    next_tracking_ids,
    origin: curr.origin,
    destination: curr.destination,
    weight: curr.weight,
    status: curr.status
  };
});
}
