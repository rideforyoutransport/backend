// emailTemplates/requestedTrip.js

module.exports = function generateRequestedTripEmail(trip) {
    const { from, to, totalSeats, user, mobile, requestDate } = trip;
  
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="text-align: center; color: #2c3e50;">🚗 New Trip Request</h2>
  
        <h3 style="margin-top: 30px;">📍 <span style="color: #2980b9;">From:</span></h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Place Name:</strong> ${from?.place_name || 'N/A'}</li>
          <li><strong>Latitude:</strong> ${from?.lat || 'N/A'}</li>
          <li><strong>Longitude:</strong> ${from?.lng || 'N/A'}</li>
          <li><strong>Place ID:</strong> ${from?.place_id || 'N/A'}</li>
        </ul>
  
        <h3 style="margin-top: 30px;">📍 <span style="color: #27ae60;">To:</span></h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Place Name:</strong> ${to?.place_name || 'N/A'}</li>
          <li><strong>Latitude:</strong> ${to?.lat || 'N/A'}</li>
          <li><strong>Longitude:</strong> ${to?.lng || 'N/A'}</li>
          <li><strong>Place ID:</strong> ${to?.place_id || 'N/A'}</li>
        </ul>
  
        <h3 style="margin-top: 30px;">🧾 <span style="color: #8e44ad;">Trip Details:</span></h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Total Seats Requested:</strong> ${totalSeats || 'N/A'}</li>
          <li><strong>Mobile Number:</strong> ${mobile || 'N/A'}</li>
          <li><strong>User ID:</strong> ${user || 'N/A'}</li>
          <li><strong>Request Date:</strong> ${requestDate || 'N/A'}</li>
        </ul>
  
        <p style="margin-top: 30px; text-align: center;">Thank you for using our platform!</p>
      </div>
    `;
  };
  