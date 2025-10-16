import React from 'react'

const VisualIntensityContext = React.createContext({ intensity: 1, setIntensity: () => {} })

export function VisualIntensityProvider({ children }){
  const [intensity, setIntensity] = React.useState(1)
  return (
    <VisualIntensityContext.Provider value={{ intensity, setIntensity }}>
      {children}
    </VisualIntensityContext.Provider>
  )
}

export function useVisualIntensity(){
  return React.useContext(VisualIntensityContext)
}
