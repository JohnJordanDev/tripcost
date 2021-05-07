const getListItemsFromJSON = (tripList) => {
  const docFrag = new DocumentFragment();
  tripList.forEach((trip) => {
    const li = window.document.createElement("li");
    li.innerHTML = `<h3>${trip.name}</h3>
        <p>A description of the trip</p>`;
    docFrag.appendChild(li);
  });
  return docFrag;
};
const tripList = window.document.getElementById("trip_list");
let trips;
const tripRequest = fetch("http://localhost:3000/trips")
  .then((response) => response.json())
  .then((jsonTrips) => {
    trips = jsonTrips;
    tripList.innerHTML = "";
    tripList.appendChild(getListItemsFromJSON(trips.trips));
  })
  .catch((e) => { console.log("an error occurred", e); });

// TODO add race to update message if more than 5 seconds have elapsed
const makeAPITimeout = (msg, time) => {
  let timerID;
  const p = new Promise((resolve) => {
    timerID = window.setTimeout(() => {
      resolve(msg);
    }, time);
  });
  const clear = () => {
    window.clearTimeout(timerID);
  };
  p.clear = clear;
  return p;
};

const tripRequestTimer = makeAPITimeout("Ending from the new timer", 5000);

Promise.race([tripRequestTimer, tripRequest])
  .then((d) => {
    console.log("data is: ", d);
  })
  .catch(console.log)
  .finally(() => {
    // clears memory held by closure in Promise constructor
    tripRequestTimer.clear();
  });
