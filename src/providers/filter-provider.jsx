'use client'
import React, { createContext, useContext, useState } from 'react'

const FilterContext = createContext(undefined)

export function FilterProvider({ children }) {
  const [date, setDate] = useState({ from: null, to: null })
  const [company, setCompany] = useState(null) // Tambahkan perusahaan aktif

  return (
    <FilterContext.Provider value={{ date, setDate, company, setCompany }}>
      {children}
    </FilterContext.Provider>
  )
}

// Custom hook untuk akses context
export function useFilterContext() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }
  return context
}
