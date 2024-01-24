import React, { useEffect, useRef } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { mapFitView } from '../utils/mapUtils'

const Map = ({ children, initialRegion, identifiers, }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    mapFitView(mapRef, identifiers);
  }, [children])

  return (
    <MapView
      loadingBackgroundColor='transparent'
      ref={mapRef}
      style={{ height: "100%", }}
      provider={PROVIDER_GOOGLE}
      mapType="mutedStandard"
      initialRegion={initialRegion}
      onMapReady={() => mapFitView(mapRef, identifiers)}

    >
      {children}
    </MapView>
  )
}

/**
 * 
 */

export default Map