module.exports = function generateRequestedTripEmail(trip) {
    const { from, to, totalSeats, user, mobile, requestDate } = trip;
  
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>🚌 New Trip Request</h2>
  
        <h3>📍 From:</h3>
        <ul>
          <li><strong>Place Name:</strong> ${from.place_name}</li>
          <li><strong>Latitude:</strong> ${from.lat}</li>
          <li><strong>Longitude:</strong> ${from.lng}</li>
          <li><strong>Place ID:</strong> ${from.place_id}</li>
        </ul>
  
        <h3>📍 To:</h3>
        <ul>
          <li><strong>Place Name:</strong> ${to.place_name}</li>
          <li><strong>Latitude:</strong> ${to.lat}</li>
          <li><strong>Longitude:</strong> ${to.lng}</li>
          <li><strong>Place ID:</strong> ${to.place_id}</li>
        </ul>
  
        <h3>🧾 Trip Details:</h3>
        <ul>
          <li><strong>Total Seats Requested:</strong> ${totalSeats}</li>
          <li><strong>Requested By (User ID):</strong> ${user}</li>
          <li><strong>Mobile Number:</strong> ${mobile}</li>
          <li><strong>Requested Date:</strong> ${requestDate}</li>
        </ul>
  
        <p style="margin-top: 20px;">Thank you for using our platform!</p>
      </div>
    `;
  };
  