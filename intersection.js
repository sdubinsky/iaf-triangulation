// from https://www.movable-type.co.uk/scripts/latlong.html
/**
 * Returns the point of intersection of two paths defined by point and bearing.
 *
 * @param   {number} lat1 - First latitude point
 * @param   {number} lon1 - First longitude point
 * @param   {number} brng1 - Initial bearing from first point.
 * @param   {number} lat2 - First latitude point 
 * @param   {number} lon2 - First longitude point
 * @param   {number} brng2 - Initial bearing from first point.
 * @returns {LatLon|null} Destination point (null if no unique intersection defined).
 *
 * @example
 *     var p1 = LatLon(51.8853, 0.2545), brng1 = 108.547;
 *     var p2 = LatLon(49.0034, 2.5735), brng2 =  32.435;
 *     var pInt = LatLon.intersection(51.8853, 0.2545, 108.547, 49.0034, 2.5735, 32.435); // 50.9078°N, 004.5084°E
 */

function LatLon(lat, lon) {
    // allow instantiation without 'new'
    if (!(this instanceof LatLon)) return new LatLon(lat, lon);

    this.lat = Number(lat);
    this.lon = Number(lon);
}
intersection = function(lat1, lon1, brng1, lat2, lon2, brng2) {
    if (lon1 == lon2){
        lon1 -= 0.00001;
    }
    p1 = LatLon(lat1, lon1)
    p2 = LatLon(lat2, lon2)

    // see www.edwilliams.org/avform.htm#Intersection

    var lat1 = p1.lat.toRadians(), lon1 = p1.lon.toRadians();
    var lat2 = p2.lat.toRadians(), lon2 = p2.lon.toRadians();
    var theta13 = Number(brng1).toRadians(), theta23 = Number(brng2).toRadians();
    var dlat = lat2-lat1, dlon = lon2-lon1;
    
    // angular distance p1-p2
    var ang_dist12 = 2*Math.asin( Math.sqrt( Math.sin(dlat/2)*Math.sin(dlat/2)
        + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)*Math.sin(dlon/2) ) );
    if (ang_dist12 == 0) return null;

    // initial/final bearings between points
    var thetatop = Math.sin(lat2) - Math.sin(lat1) * Math.cos(ang_dist12);
    var thetabottom = Math.sin(ang_dist12) * Math.cos(lat1)
    var thetaa = Math.acos( ( Math.sin(lat2) - Math.sin(lat1)*Math.cos(ang_dist12) ) / ( Math.sin(ang_dist12)*Math.cos(lat1)));
    if (isNaN(thetaa)) thetaa = 0; // protect against rounding
    var thetab = Math.acos( ( Math.sin(lat1) - Math.sin(lat2)*Math.cos(ang_dist12) ) / ( Math.sin(ang_dist12)*Math.cos(lat2) ) );
    if (isNaN(thetab)) thetab = 0; // protect against rounding
    var theta12 = Math.sin(lon2-lon1)>0 ? thetaa : 2*Math.PI-thetaa;
    var theta21 = Math.sin(lon2-lon1)>0 ? 2*Math.PI-thetab : thetab;

    var alpha1 = theta13 - theta12; // angle 2-1-3
    var alpha2 = theta21 - theta23; // angle 1-2-3

    if (Math.sin(alpha1)==0 && Math.sin(alpha2)==0) return null; // infinite intersections
    if (Math.sin(alpha1)*Math.sin(alpha2) < 0) return null;      // ambiguous intersection

    var alpha3 = Math.acos( -Math.cos(alpha1)*Math.cos(alpha2) + Math.sin(alpha1)*Math.sin(alpha2)*Math.cos(ang_dist12) );
    var ang_dist13 = Math.atan2( Math.sin(ang_dist12)*Math.sin(alpha1)*Math.sin(alpha2), Math.cos(alpha2)+Math.cos(alpha1)*Math.cos(alpha3) );
    var lat3 = Math.asin( Math.sin(lat1)*Math.cos(ang_dist13) + Math.cos(lat1)*Math.sin(ang_dist13)*Math.cos(theta13) );
    var dlon13 = Math.atan2( Math.sin(theta13)*Math.sin(ang_dist13)*Math.cos(lat1), Math.cos(ang_dist13)-Math.sin(lat1)*Math.sin(lat3) );
    var lon3 = lon1 + dlon13;

    return new LatLon(lat3.toDegrees(), (lon3.toDegrees()+540)%360-180); // normalise to −180..+180°
};
//from https://gps-coordinates.org/js/distance.js
function distance(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

    var dLat = (lat2-lat1).toRadians();
    var dLon = (lon2-lon1).toRadians();

    lat1 = Number(lat1).toRadians();
    lat2 = Number(lat2).toRadians();

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c * 1000;
}

/** Extend Number object with method to convert numeric degrees to radians */
if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
}

/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (Number.prototype.toDegrees === undefined) {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module != 'undefined' && module.exports) module.exports = LatLon; // ≡ export default LatLon
