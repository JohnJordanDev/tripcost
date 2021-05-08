const tripList = window.document.getElementById("trip_list");

const updateUserMessage = (newMessage) => {
  const p = window.document.createElement("p");
  p.textContent = newMessage;
  tripList.innerHTML = "";
  tripList.append(p);
};

const getListItemsFromJSON = (listOfTrips) => {
  const docFrag = new DocumentFragment();
  listOfTrips.forEach((trip) => {
    const li = window.document.createElement("li");
    li.innerHTML = `<h3>${trip.name}</h3>
        <p>A description of the trip</p>`;
    docFrag.appendChild(li);
  });
  return docFrag;
};

let trips;

const updatePageWithTrips = (jsonTrips) => {
  trips = jsonTrips;
  tripList.innerHTML = "";
  tripList.appendChild(getListItemsFromJSON(trips.trips));
  return true;
};

const tripRequest = fetch("http://localhost:3000/trips")
  .then((response) => response.json())
  .catch((e) => { console.log("an error occurred fetching trips", e); });

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

const tripRequestTimer = makeAPITimeout(null, 5000);

Promise.race([tripRequestTimer, tripRequest])
  .then((tripJSON) => {
    if (tripJSON) {
      updatePageWithTrips(tripJSON);
    } else {
      updateUserMessage("Sorry, the server took too long to respond");
    }
  })
  .catch(updateUserMessage)
  .finally(() => {
    // clears memory held by closure in Promise constructor
    tripRequestTimer.clear();
  });
