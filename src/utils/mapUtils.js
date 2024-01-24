
export const mapFitView = (mapRef, identifiers) => {
  mapRef.current.fitToSuppliedMarkers(identifiers, {
    edgePadding: {
      top: 200,
      bottom: 100,
      left: 50,
      right: 50,
    },
  })
}